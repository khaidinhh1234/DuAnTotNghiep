<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\ChuongTrinhUuDai;
use App\Models\MaKhuyenMai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class KhuyenMaiController extends Controller
{
    public function danhSachMaKhuyenMaiTheoNguoiDung(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['status' => false, 'message' => 'Bạn cần đăng nhập để xem mã khuyến mãi.'], 401);
            }

            $data = MaKhuyenMai::query()
                ->join('nguoi_dung_ma_khuyen_mai', 'ma_khuyen_mais.id', '=', 'nguoi_dung_ma_khuyen_mai.ma_khuyen_mai_id')
                ->where('nguoi_dung_ma_khuyen_mai.user_id', $user->id)
                ->select('ma_khuyen_mais.*', 'nguoi_dung_ma_khuyen_mai.da_su_dung', 'nguoi_dung_ma_khuyen_mai.ngay_su_dung')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách mã khuyến mãi',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra khi lấy danh sách mã khuyến mãi.', 'error' => $e->getMessage()], 500);
        }
    }

    public function danhSachChuongTrinhUuDai()
    {
        try {
            $chuongTrinh = ChuongTrinhUuDai::query()
                ->where('ngay_hien_thi', '<=', Carbon::now())
                ->where('ngay_ket_thuc', '>=', Carbon::now())
                ->orderBy('ngay_hien_thi')
                ->orderByDesc('id')
                ->get();

            if ($chuongTrinh->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy chương trình ưu đãi.'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $chuongTrinh
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra khi lấy danh sách chương trình ưu đãi.', 'error' => $e->getMessage()], 500);
        }
    }

    public function chiTietChuongTrinhUuDai($slug)
    {
        try {
            $chuongTrinh = ChuongTrinhUuDai::query()
                ->with([
                    'sanPhams.bienTheSanPham',
                    'sanPhams.bienTheSanPham.mauBienThe',
                    'sanPhams.bienTheSanPham.kichThuocBienThe',
                    'sanPhams.bienTheSanPham.anhBienThe',
                ])
                ->where('duong_dan', $slug)
                ->first();

            if (!$chuongTrinh) {
                return response()->json(['status' => false, 'message' => 'Chương trình ưu đãi không tồn tại.'], 404);
            }

            if (Carbon::now()->lt($chuongTrinh->ngay_bat_dau)) {
                return response()->json([
                    'status' => true,
                    'data' => [
                        'chuong_trinh' => $chuongTrinh,
                        'trang_thai' => 'Chưa bắt đầu chương trình',
                    ]
                ]);
            }

            if ($chuongTrinh->nagy_bat_dau <= Carbon::now() && $chuongTrinh->ngay_ket_thuc >= Carbon::now()) {
                return response()->json([
                    'status' => true,
                    'data' => $chuongTrinh,
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Chương trình ưu đãi đã kết thúc.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra khi lấy chi tiết chương trình ưu đãi.', 'error' => $e->getMessage()], 400);
        }
    }


    public function layMaKhuyenMaiTheoHangThanhVien()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['status' => false, 'message' => 'Bạn cần đăng nhập để xem mã khuyến mãi.'], 401);
            }

            $hangThanhVien = $user->hangThanhVien;

            if (!$hangThanhVien) {
                return response()->json(['status' => false, 'message' => 'Bạn chưa được phân loại vào hạng thành viên.'], 400);
            }

            $maKhuyenMais = MaKhuyenMai::whereHas('hangThanhViens', function ($query) use ($hangThanhVien) {
                $query->where('hang_thanh_vien_id', $hangThanhVien->id);
            })
                ->where('trang_thai', 1)
                ->where('ngay_bat_dau_suu_tam', '<=', now())
                ->where('ngay_ket_thuc', '>=', now())
                ->whereColumn('so_luong_da_su_dung', '<', 'so_luong')
                ->get();

            if ($maKhuyenMais->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Không có mã khuyến mãi nào cho hạng thành viên của bạn.'], 404);
            }

            foreach ($maKhuyenMais as $maKhuyenMai) {
                $maKhuyenMai->da_thu_thap = $maKhuyenMai->user()->where('id', $user->id)->exists() ? 1 : 0;
            }

            return response()->json(['status' => true, 'data' => $maKhuyenMais]);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy mã khuyến mãi: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy mã khuyến mãi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function thuThapMaKhuyenMai($maCode)
    {
        try {
            $maKhuyenMai = MaKhuyenMai::where('ma_code', $maCode)->firstOrFail();

            if ($maKhuyenMai->trang_thai == 0) {
                return response()->json(['status' => false, 'message' => 'Mã khuyến mãi này đã hết hạn sử dụng.'], 400);
            }

            $user = Auth::user();
            if (!$user) {
                return response()->json(['status' => false, 'message' => 'Bạn cần đăng nhập để áp dụng mã khuyến mãi.'], 401);
            }

            $isMemberEligible = $maKhuyenMai->hangThanhViens()->where('id', $user->hang_thanh_vien_id)->exists();

            if (!$isMemberEligible) {
                return response()->json(['status' => false, 'message' => 'Bạn không thuộc hạng thành viên áp dụng cho mã khuyến mãi này.'], 403);
            }

            if ($maKhuyenMai->so_luong_da_su_dung >= $maKhuyenMai->so_luong) {
                return response()->json(['status' => false, 'message' => 'Mã khuyến mãi đã hết.'], 404);
            }

            DB::beginTransaction();

            $maKhuyenMai->increment('so_luong_da_su_dung');
            $maKhuyenMai->user()->syncWithoutDetaching($user->id);

            if ($maKhuyenMai->so_luong_da_su_dung >= $maKhuyenMai->so_luong) {
                $maKhuyenMai->update(['trang_thai' => 0]);
            }

            DB::commit();

            return response()->json(['status' => true, 'message' => 'Thu thập mã khuyến mãi thành công.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra khi xử lý mã khuyến mãi.', 'error' => $e->getMessage()], 400);
        }
    }


    public function timKiemMaKhuyenMai(Request $request)
    {
        try {
            $validate = Validator::make($request->all(), [
                'key' => 'required|string|max:255',
            ]);

            if ($validate->fails()) {
                return response()->json(['status' => false, 'message' => $validate->errors()->first()], 400);
            }

            $user = Auth::user();
            $memberLevelId = $user->hang_thanh_vien_id;

            $maKhuyenMais = MaKhuyenMai::where('trang_thai', 1)
                ->where('ma_code', $request->key)
                ->where('ngay_bat_dau', '<=', now())
                ->where('ngay_ket_thuc', '>=', now())
                ->whereHas('hangThanhViens', function ($query) use ($memberLevelId) {
                    $query->where('id', $memberLevelId);
                })
                ->first();

            if (!$maKhuyenMais) {
                return response()->json(['status' => false, 'message' => 'Mã khuyến mãi không hợp lệ, đã hết hạn hoặc không áp dụng cho hạng thành viên của bạn.'], 404);
            }

            if ($maKhuyenMais->so_luong_da_su_dung >= $maKhuyenMais->so_luong) {
                return response()->json(['status' => false, 'message' => 'Mã khuyến mãi đã hết.'], 404);
            }

            return response()->json(['status' => true, 'data' => $maKhuyenMais]);

        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra khi tìm kiếm mã khuyến mãi.', 'error' => $e->getMessage()], 500);
        }
    }


}
