<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\AnhBienThe;
use App\Models\BienTheSanPham;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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
            'ten_san_pham' => 'required|string|max:255',
            'anh_san_pham' => 'required',
            'mo_ta_ngan' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            'danh_muc_id' => 'required|integer',
            'the' => 'required|array',
            'bien_the' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dataSanPham = $request->except('bien_the', 'the');
        $dataSanPham['ma_san_pham'] = 'SP-' . random_int(1000, 5000) . '-' . random_int(5001, 9999);
        $dataSanPham['duong_dan'] = Str::slug($dataSanPham['ten_san_pham']);
        $theSanPham = $request->the;
        $bienTheSanPhamTmp = $request->bien_the;

        $bienTheSanPham = [];

        foreach ($bienTheSanPhamTmp as $key => $value) {
            $tmp = explode('-', $key);
            if ($value['gia_ban'] !== null && $value['so_luong_bien_the'] !== null) {
                $bienTheSanPham[] = [
                    'bien_the_mau_sac_id' => $tmp[0],
                    'bien_the_kich_thuoc_id' => $tmp[1],
                    'gia_ban' => $value['gia_ban'],
                    'gia_khuyen_mai' => $value['gia_khuyen_mai'],
                    'so_luong_bien_the' => $value['so_luong_bien_the'],
                    'anh' => $value['anh'] ?? []
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
            'ten_san_pham' => 'required|string|max:255',
            'anh_san_pham' => 'required',
            'mo_ta_ngan' => 'required|string|max:255',
            'noi_dung' => 'required|string',
            'danh_muc_id' => 'required|integer',
            'the' => 'required|array',
            'bien_the' => 'required|array',
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

        foreach ($bienTheSanPhamTmp as $key => $value) {
            $tmp = explode('-', $key);
            if ($value['gia_ban'] !== null && $value['so_luong_bien_the'] !== null) {
                $bienTheSanPham[] = [
                    'bien_the_mau_sac_id' => $tmp[0],
                    'bien_the_kich_thuoc_id' => $tmp[1],
                    'gia_ban' => $value['gia_ban'],
                    'gia_khuyen_mai' => $value['gia_khuyen_mai'],
                    'so_luong_bien_the' => $value['so_luong_bien_the'],
                    'anh' => $value['anh'] ?? []
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
            $sanPhamDaXoa = SanPham::onlyTrashed()->with(['danhMuc'])->orderBy('deleted_at', 'desc')->get();

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
            ], 500);
        }
    }
}
