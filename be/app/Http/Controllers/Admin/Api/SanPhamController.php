<?php

namespace App\Http\Controllers\Admin\Api;

use App\Exports\SanPhamExports;
use App\Http\Controllers\Controller;
use App\Models\AnhBienThe;
use App\Models\BienTheSanPham;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class SanPhamController extends Controller
{
    public function index()
    {
        try {
            $data = SanPham::with([
                'danhMuc',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'theSanPham'
            ])
                ->orderByDesc('id')
                ->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_san_pham' => 'required|string|max:255|unique:san_phams,ten_san_pham',
            'anh_san_pham' => 'required|string',
            'ma_san_pham' => 'required|string|max:255|unique:san_phams,ma_san_pham',
            'mo_ta_ngan' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            'danh_muc_id' => 'required|integer',
            'the' => 'required|array',
            'the.*' => 'integer',
            'bien_the' => 'required|array',
            'bien_the.*.mau_sac_id' => 'required|integer',
            'bien_the.*.kich_thuoc_id' => 'required|integer',
            'bien_the.*.gia_ban' => 'required|numeric',
            'bien_the.*.gia_khuyen_mai' => 'nullable|numeric|lt:bien_the.*.gia_ban', // Giá khuyến mãi phải nhỏ hơn giá bán
            'bien_the.*.ngay_bat_dau_khuyen_mai' => 'nullable|date|required_if:bien_the.*.gia_khuyen_mai,!=,null',
            'bien_the.*.ngay_ket_thuc_khuyen_mai' => 'nullable|date|required_if:bien_the.*.gia_khuyen_mai,!=,null|after_or_equal:bien_the.*.ngay_bat_dau_khuyen_mai',
            'bien_the.*.so_luong_bien_the' => 'required|integer',
            'bien_the.*.anh' => 'required|array',
            'bien_the.*.anh.*' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $dataSanPham = $request->except('bien_the', 'the');
        $dataSanPham['duong_dan'] = Str::slug($dataSanPham['ten_san_pham']);
        $theSanPham = $request->the;
        $bienTheSanPhamTmp = $request->bien_the;

        $bienTheSanPham = [];

        foreach ($bienTheSanPhamTmp as $value) {
            if ($value['gia_ban'] !== null && $value['so_luong_bien_the'] !== null) {
                $bienTheSanPham[] = [
                    'bien_the_mau_sac_id' => $value['mau_sac_id'],
                    'bien_the_kich_thuoc_id' => $value['kich_thuoc_id'],
                    'gia_ban' => $value['gia_ban'],
                    'gia_khuyen_mai' => $value['gia_khuyen_mai'],
                    'so_luong_bien_the' => $value['so_luong_bien_the'],
                    'anh' => $value['anh'] ?? [],
                    'ngay_bat_dau_khuyen_mai' => $value['ngay_bat_dau_khuyen_mai'],
                    'ngay_ket_thuc_khuyen_mai' => $value['ngay_ket_thuc_khuyen_mai']
                ];
            }
        }

        try {
            DB::beginTransaction();
            $sanPham = SanPham::create($dataSanPham);

            foreach ($bienTheSanPham as $bienThe) {
                $anhBienThe = $bienThe['anh'];
                unset($bienThe['anh']);

                $bienTheSP = BienTheSanPham::create(array_merge($bienThe, ['san_pham_id' => $sanPham->id]));

                foreach ($anhBienThe as $anh) {
                    if ($anh !== null) {
                        AnhBienThe::create([
                            'bien_the_san_pham_id' => $bienTheSP->id,
                            'duong_dan_anh' => $anh
                        ]);
                    }
                }
            }

            $sanPham->theSanPham()->sync($theSanPham);
            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã được tạo thành công!',
                'data' => $sanPham
            ], 201);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi tạo sản phẩm.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }


    public function show($id)
    {
        try {
            $sanPham = SanPham::with([
                'danhMuc',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'theSanPham'
            ])->findOrFail($id);

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $sanPham
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu',
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ten_san_pham' => 'required|string|max:255|unique:san_phams,ten_san_pham,' . $id,
            'anh_san_pham' => 'required|string',
            'ma_san_pham' => 'required|string|max:255|unique:san_phams,ma_san_pham,' . $id,
            'mo_ta_ngan' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            'danh_muc_id' => 'required|integer',
            'the' => 'required|array',
            'bien_the' => 'required|array',
            'bien_the.*.mau_sac_id' => 'required|integer',
            'bien_the.*.kich_thuoc_id' => 'required|integer',
            'bien_the.*.gia_ban' => 'required|numeric',
            'bien_the.*.gia_khuyen_mai' => 'nullable|numeric|lt:bien_the.*.gia_ban', // Giá khuyến mãi phải nhỏ hơn giá bán
            'bien_the.*.ngay_bat_dau_khuyen_mai' => 'nullable|date|required_if:bien_the.*.gia_khuyen_mai,!=,null',
            'bien_the.*.ngay_ket_thuc_khuyen_mai' => 'nullable|date|required_if:bien_the.*.gia_khuyen_mai,!=,null|after_or_equal:bien_the.*.ngay_bat_dau_khuyen_mai',
            'bien_the.*.so_luong_bien_the' => 'required|integer',
            'bien_the.*.anh' => 'nullable|array',
            'bien_the.*.anh.*' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $sanPham = SanPham::findOrFail($id);

        $dataSanPham = $request->except('bien_the', 'the');
        $dataSanPham['duong_dan'] = Str::slug($dataSanPham['ten_san_pham']);
        $theSanPham = $request->the;
        $bienTheSanPhamTmp = $request->bien_the;

        $bienTheSanPham = [];

        foreach ($bienTheSanPhamTmp as $value) {
            if ($value['gia_ban'] !== null && $value['so_luong_bien_the'] !== null) {
                $bienTheSanPham[] = [
                    'bien_the_mau_sac_id' => $value['mau_sac_id'],
                    'bien_the_kich_thuoc_id' => $value['kich_thuoc_id'],
                    'gia_ban' => $value['gia_ban'],
                    'gia_khuyen_mai' => $value['gia_khuyen_mai'],
                    'so_luong_bien_the' => $value['so_luong_bien_the'],
                    'anh' => $value['anh'] ?? [],
                    'ngay_bat_dau_khuyen_mai' => $value['ngay_bat_dau_khuyen_mai'],
                    'ngay_ket_thuc_khuyen_mai' => $value['ngay_ket_thuc_khuyen_mai']
                ];
            }
        }

        try {
            DB::beginTransaction();

            $sanPham->update($dataSanPham);

            foreach ($bienTheSanPham as $bienThe) {
                $anhBienThe = $bienThe['anh'];
                unset($bienThe['anh']);

                $bienTheSP = BienTheSanPham::updateOrCreate(
                    [
                        'san_pham_id' => $sanPham->id,
                        'bien_the_mau_sac_id' => $bienThe['bien_the_mau_sac_id'],
                        'bien_the_kich_thuoc_id' => $bienThe['bien_the_kich_thuoc_id']
                    ],
                    $bienThe
                );

                AnhBienThe::where('bien_the_san_pham_id', $bienTheSP->id)->delete();

                foreach ($anhBienThe as $anh) {
                    if ($anh !== null) {
                        AnhBienThe::create([
                            'bien_the_san_pham_id' => $bienTheSP->id,
                            'duong_dan_anh' => $anh
                        ]);
                    }
                }
            }

            $sanPham->theSanPham()->sync($theSanPham);

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Sản phẩm đã được cập nhật thành công!',
                'data' => $sanPham
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }


    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $sanPham = SanPham::with(['bienTheSanPham.anhBienThe', 'theSanPham'])->findOrFail($id);

            foreach ($sanPham->bienTheSanPham as $bienThe) {
                foreach ($bienThe->anhBienThe as $anh) {
                    $anh->delete();
                }
                $bienThe->delete();
            }

            $sanPham->theSanPham()->sync([]);
            $sanPham->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Sản phẩm đã được xóa thành công.'
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xóa sản phẩm thất bại!',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function danhSachSanPhamDaXoa()
    {
        try {
            $sanPhamDaXoa = SanPham::onlyTrashed()->with([
            'danhMuc',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'theSanPham'
            ])->orderBy('deleted_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $sanPhamDaXoa,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại!',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function khoiPhucSanPham(int $id)
    {
        try {
            DB::beginTransaction();

            $sanPham = SanPham::onlyTrashed()->with(['bienTheSanPham', 'theSanPham'])->findOrFail($id);

            $sanPham->restore();

            foreach ($sanPham->bienTheSanPham()->onlyTrashed()->get() as $bienThe) {
                $bienThe->restore();
                $bienThe->anhBienThe()->onlyTrashed()->restore();
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'status_code' => 200,
                'message' => 'Khôi phục sản phẩm thành công',
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'status_code' => 500,
                'message' => 'Khôi phục sản phẩm thất bại',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function kichHoatSanPham(int $id)
    {
        try {
            SanPham::query()->findOrFail($id)->update(['trang_thai' => 1]);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Kích hoạt sản phẩm thành công',
            ];
            return response()->json($json, 200);
        } catch (\Exception $exception) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Kích hoạt sản phẩm thất bại',
                'error' => $exception->getMessage()
            ];
            return response()->json($json, 500);
        }
    }

    public function huyKichHoatSanPham(int $id)
    {
        try {
            SanPham::query()->findOrFail($id)->update(['trang_thai' => 0]);
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Huỷ kích hoạt sản phẩm thành công',
            ];
            return response()->json($json, 200);
        } catch (\Exception $exception) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Huỷ kích hoạt sản phẩm thất bai',
                'error' => $exception->getMessage()
            ];
            return response()->json($json, 500);
        }
    }

    public function exportSanPham()
    {
        return Excel::download(new SanPhamExports, 'sanpham.xlsx');
    }
}
