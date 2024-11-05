<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\SendMail;
use App\Exports\SanPhamExports;
use App\Http\Controllers\Controller;
use App\Models\AnhBienThe;
use App\Models\BienTheSanPham;
use App\Models\SanPham;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                'boSuuTapSanPham'
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
            'mo_ta_ngan' => 'required|string',
            'noi_dung' => 'required|string',
            'danh_muc_id' => 'required|integer',
            'gia_tot' => 'nullable|boolean',
            'bo_suu_tap' => 'nullable|array',
            'bo_suu_tap.*' => 'integer',
            'bien_the' => 'required|array',
            'bien_the.*.mau_sac_id' => 'required|integer',
            'bien_the.*.kich_thuoc_id' => 'required|integer',
            'bien_the.*.chi_phi_san_xuat' => 'nullable|integer',
            'bien_the.*.so_luong_bien_the' => 'nullable|integer',
            'bien_the.*.gia_ban' => 'nullable|integer|gt:bien_the.*.chi_phi_san_xuat',
            'bien_the.*.gia_khuyen_mai' => 'nullable|integer|lt:bien_the.*.gia_ban',
            'bien_the.*.anh' => 'nullable|array',
            'bien_the.*.anh.*' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $dataSanPham = $request->except('bien_the', 'bo_suu_tap');
        $dataSanPham['duong_dan'] = Str::slug($dataSanPham['ten_san_pham']);
        $boSuuTapSanPham = $request->bo_suu_tap;
        $bienTheSanPhamTmp = $request->bien_the;
        $bienTheSanPham = [];

        foreach ($bienTheSanPhamTmp as $value) {
            if ($value['so_luong_bien_the'] !== null) {
                $bienTheSanPham[] = [
                    'bien_the_mau_sac_id' => $value['mau_sac_id'],
                    'bien_the_kich_thuoc_id' => $value['kich_thuoc_id'],
                    'so_luong_bien_the' => $value['so_luong_bien_the'],
                    'chi_phi_san_xuat' => $value['chi_phi_san_xuat'],
                    'gia_ban' => $value['gia_ban'],
                    'gia_khuyen_mai' => $value['gia_khuyen_mai'] ?? null,
                    'anh' => $value['anh'] ?? [],
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
            $sanPham->boSuuTapSanPham()->sync($boSuuTapSanPham);
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
                'danhGias.user',
                'bienTheSanPham.anhBienThe',
                'bienTheSanPham.mauBienThe',
                'bienTheSanPham.kichThuocBienThe',
                'boSuuTapSanPham',
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
            'gia_tot' => 'nullable|boolean',
            'bo_suu_tap' => 'nullable|array',
            'bo_suu_tap.*' => 'integer',
            'bien_the' => 'required|array',
            'bien_the.*.mau_sac_id' => 'required|integer',
            'bien_the.*.kich_thuoc_id' => 'required|integer',
            'bien_the.*.chi_phi_san_xuat' => 'nullable|integer',
            'bien_the.*.so_luong_bien_the' => 'nullable|integer',
            'bien_the.*.gia_ban' => 'nullable|integer|gt:bien_the.*.chi_phi_san_xuat',
            'bien_the.*.gia_khuyen_mai' => 'nullable|integer|lt:bien_the.*.gia_ban', // Giá khuyến mãi phải nhỏ hơn giá bán
            'bien_the.*.anh' => 'nullable|array',
            'bien_the.*.anh.*' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $sanPham = SanPham::findOrFail($id);

        $dataSanPham = $request->except('bien_the', 'bo_suu_tap');
        $dataSanPham['duong_dan'] = Str::slug($dataSanPham['ten_san_pham']);
        $boSuuTapSanPham = $request->bo_suu_tap;
        $bienTheSanPhamTmp = $request->bien_the;

        $bienTheSanPham = [];

        foreach ($bienTheSanPhamTmp as $value) {
            if ($value['so_luong_bien_the'] !== null) {
                $bienTheSanPham[] = [
                    'bien_the_mau_sac_id' => $value['mau_sac_id'],
                    'bien_the_kich_thuoc_id' => $value['kich_thuoc_id'],
                    'so_luong_bien_the' => $value['so_luong_bien_the'],
                    'chi_phi_san_xuat' => $value['chi_phi_san_xuat'],
                    'gia_ban' => $value['gia_ban'],
                    'gia_khuyen_mai' => $value['gia_khuyen_mai'] ?? null,
                    'anh' => $value['anh'] ?? [],
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

            $sanPham->boSuuTapSanPham()->sync($boSuuTapSanPham);

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

            $sanPham = SanPham::with(['bienTheSanPham.anhBienThe', 'boSuuTapSanPham'])->findOrFail($id);
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
                'boSuuTapSanPham'
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

            $sanPham = SanPham::onlyTrashed()->with(['bienTheSanPham', 'boSuuTapSanPham'])->findOrFail($id);

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

    public function danhSachSanPhamYeuThich()
    {
        try {
            if (Auth::guard('api')->check()) {
                $userId = Auth::guard('api')->id();
                $user = User::findOrFail($userId);
                $data = $user->sanPhamYeuThich()
                    ->with([
                        'danhMuc',
                        'bienTheSanPham.anhBienThe',
                        'bienTheSanPham.mauBienThe',
                        'bienTheSanPham.kichThuocBienThe',
                        'boSuuTapSanPham'
                    ])
                    ->select(
                        'san_phams.id',
                        'san_phams.ten_san_pham',
                        'san_phams.anh_san_pham',
                        'san_phams.created_at',
                        'san_phams.ma_san_pham',
                        'san_phams.duong_dan',
                        'san_phams.hang_moi',
                        'san_pham_yeu_thich.user_id as pivot_user_id',
                        'san_pham_yeu_thich.san_pham_id as pivot_san_pham_id'
                    )
                    ->addSelect([
                        DB::raw('MIN(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_thap_nhat'),
                        DB::raw('MAX(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_cao_nhat')
                    ])
                    ->leftJoin('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                    ->groupBy(
                        'san_phams.id',
                        'san_phams.ten_san_pham',
                        'san_phams.anh_san_pham',
                        'san_phams.created_at',
                        'san_phams.ma_san_pham',
                        'san_phams.duong_dan',
                        'san_phams.hang_moi',
                        'pivot_user_id',
                        'pivot_san_pham_id'
                    )
                    ->get()
                    ->map(function ($sanPham) {
                        $sanPham->mau_sac_va_anh = $sanPham->bienTheSanPham->map(function ($bienThe) {
                            return [
                                // Lấy URL của ảnh đầu tiên trong bộ sưu tập `anhBienThe`
                                'hinh_anh' => optional($bienThe->anhBienThe->first())->duong_dan_anh,
                                'ma_mau_sac' => optional($bienThe->mauBienThe)->ma_mau_sac,
                                'ten_mau_sac' => optional($bienThe->mauBienThe)->ten_mau_sac,
                            ];
                        })->unique(function ($item) {
                            return $item['ma_mau_sac'];
                        })->values()->toArray();
                        return $sanPham;
                    });

                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $data,
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 401,
                    'message' => 'Vui lòng đăng nhập để xem danh sách sản phẩm yêu thích',
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy dữ liệu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function sanPhamYeuThich(string $id)
    {
        try {
            if (!Auth::guard('api')->check()) {
                return response()->json([
                    'status' => false,
                    'status_code' => 401,
                    'mess' => 'Vui lòng đăng nhập để thêm sản phẩm yêu thích',
                ], 401);
            }

            $userId = Auth::guard('api')->id();
            $user = User::findOrFail($userId);
            $sanPham = SanPham::findOrFail($id);

            $isFavorite = $user->sanPhamYeuThich()->where('san_pham_id', $id)->exists();

            if ($isFavorite) {
                $user->sanPhamYeuThich()->detach($id);
                $mess = 'Sản phẩm đã được xóa khỏi danh sách yêu thích';
            } else {
                $user->sanPhamYeuThich()->attach($id);
                $mess = 'Sản phẩm đã được thêm vào danh sách yêu thích';
            }

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'mess' => $mess,
                'data' => $sanPham,
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'mess' => $exception->getMessage(),
            ], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        $validatedData = $request->validate([
            'san_phams' => 'required|array',
            'san_phams.*' => 'required|exists:san_phams,id',
        ]);

        SanPham::whereIn('id', $validatedData['san_phams'])->delete();

        return response()->json(['message' => 'Xóa thành công'], 200);
    }


    public function updateStatus(Request $request)
    {
        $validatedData = $request->validate([
            'san_phams' => 'required|array',
            'san_phams.*' => 'required|exists:san_phams,id',
            'trang_thai' => 'required|boolean',
        ]);

        SanPham::whereIn('id', $validatedData['san_phams'])->update(['trang_thai' => $validatedData['trang_thai']]);

        return response()->json(['message' => 'Cập nhật trạng thái thành công'], 200);
    }

    public function bulkUpdateTags(Request $request)
    {
        $validatedData = $request->validate([
            'san_phams' => 'required|array',
            'san_phams.*' => 'required|exists:san_phams,id',
            'thes' => 'required|array',
            'thes.*' => 'required|exists:thes,id',
        ]);

        foreach ($validatedData['san_phams'] as $sanPhamId) {
            $sanPham = SanPham::find($sanPhamId);

            if (!$sanPham) {
                return response()->json(['message' => "Sản phẩm với ID $sanPhamId không tìm thấy"], 404);
            }

            $sanPham->theSanPham()->sync($validatedData['thes']);
        }

        return response()->json(['message' => 'Cập nhật thẻ thành công cho các sản phẩm'], 200);
    }

    public function bulkRestore(Request $request)
    {
        $validatedData = $request->validate([
            'san_phams' => 'required|array',
            'san_phams.*' => 'required|exists:san_phams,id',
        ]);

        SanPham::whereIn('id', $validatedData['san_phams'])->restore();

        return response()->json(['message' => 'Khôi phục thành công cho các sản phẩm'], 200);
    }
}
