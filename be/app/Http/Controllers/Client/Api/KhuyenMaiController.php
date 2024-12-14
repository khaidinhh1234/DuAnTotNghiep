<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\ChuongTrinhUuDai;
use App\Models\MaKhuyenMai;
use App\Models\SanPham;
use App\Traits\LocSanPhamTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class KhuyenMaiController extends Controller
{
    use LocSanPhamTrait;
    public function danhSachMaKhuyenMaiTheoNguoiDung(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['status' => false, 'message' => 'Bạn cần đăng nhập để xem mã khuyến mãi.'], 401);
            }

            $currentDate = now();

            $data = MaKhuyenMai::query()
                ->join('nguoi_dung_ma_khuyen_mai', 'ma_khuyen_mais.id', '=', 'nguoi_dung_ma_khuyen_mai.ma_khuyen_mai_id')
                ->where('nguoi_dung_ma_khuyen_mai.user_id', $user->id)
                ->where('ma_khuyen_mais.ngay_bat_dau', '<=', $currentDate)
                ->where('ma_khuyen_mais.ngay_ket_thuc', '>=', $currentDate)
                ->where('trang_thai', 1)
                ->where('nguoi_dung_ma_khuyen_mai.da_su_dung', 0)
                ->select(
                    'ma_khuyen_mais.*',
                    'nguoi_dung_ma_khuyen_mai.da_su_dung',
                    'nguoi_dung_ma_khuyen_mai.ngay_su_dung',
                    DB::raw("IF(nguoi_dung_ma_khuyen_mai.da_su_dung, 'Đã sử dụng', 'Chưa sử dụng') as trang_thai_su_dung")
                )
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách mã khuyến mãi',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách mã khuyến mãi.',
                'error' => $e->getMessage()
            ], 500);
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


    public function chiTietChuongTrinhUuDai($slug, Request $request)
    {
        try {
            $chuongTrinh = ChuongTrinhUuDai::query()
                ->where('duong_dan', $slug)
                ->first();

            if (!$chuongTrinh) {
                return response()->json(['status' => false, 'message' => 'Chương trình ưu đãi không tồn tại.'], 404);
            }

            $sanPhamIds = $chuongTrinh->sanPhams->pluck('id')->toArray();
//            dd($sanPhamIds);
            $danhSachLoc = $this->layDanhMucMauSacKichThuoc($sanPhamIds);
            $sanPhamDetails = $this->locSanPham($sanPhamIds, $request);
            $sanPhamData = $sanPhamDetails->getData();
            $chuongTrinh->san_pham = $sanPhamData->data;
            $chuongTrinh->danh_sach_loc = $danhSachLoc;

            $ngayBatDau = $chuongTrinh->ngay_bat_dau ? Carbon::parse($chuongTrinh->ngay_bat_dau) : null;
            $ngayKetThuc = $chuongTrinh->ngay_ket_thuc ? Carbon::parse($chuongTrinh->ngay_ket_thuc) : null;
            $ngayHienTai = Carbon::now();

            $chuongTrinh->bat_dau = $ngayBatDau ? $ngayBatDau->format('d-m-Y') : null;

            if ($ngayBatDau && $ngayHienTai < $ngayBatDau) {
                return response()->json([
                    'status' => true,
                    'trang_thai' => 'Chưa bắt đầu chương trình',
                    'data' => [
                        'chuong_trinh' => $chuongTrinh,
                    ]
                ]);
            } elseif ($ngayKetThuc && $ngayHienTai > $ngayKetThuc) {
                return response()->json([
                    'status' => false,
                    'message' => 'Chương trình ưu đãi đã kết thúc.',
                ], 400);
            } else {
                return response()->json([
                    'status' => true,
                    'trang_thai' => 'Chương trình đang diễn ra',
                    'data' => [
                        'chuong_trinh' => $chuongTrinh,
                    ]
                ]);
            }
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
                ->join('nguoi_dung_ma_khuyen_mai', 'ma_khuyen_mais.id', '=', 'nguoi_dung_ma_khuyen_mai.ma_khuyen_mai_id')
                ->where('trang_thai', 1)
                ->where('ngay_bat_dau_suu_tam', '<=', now())
                ->where('ngay_ket_thuc', '>=', now())
                ->whereColumn('so_luong_da_su_dung', '<', 'so_luong')
                ->where('nguoi_dung_ma_khuyen_mai.da_su_dung', 0)
                ->get();

            if ($maKhuyenMais->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Không có mã khuyến mãi nào cho hạng thành viên của bạn.'], 404);
            }

            foreach ($maKhuyenMais as $maKhuyenMai) {
                $nguoiDungMaKhuyenMai = $maKhuyenMai->user()->where('id', $user->id)->first();

                $maKhuyenMai->da_thu_thap = $nguoiDungMaKhuyenMai ? 1 : 0;
                $maKhuyenMai->trang_thai_su_dung = $nguoiDungMaKhuyenMai && $nguoiDungMaKhuyenMai->pivot->da_su_dung
                    ? 'Đã sử dụng'
                    : 'Chưa sử dụng';
            }

            return response()->json(['status' => true, 'data' => $maKhuyenMais]);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy mã khuyến mãi: ' . $e->getMessage());

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
                'ma' => 'required|string|max:255',
            ]);

            if ($validate->fails()) {
                return response()->json(['status' => false, 'message' => $validate->errors()->first()], 400);
            }

            $user = Auth::user();
            $memberLevelId = $user->hang_thanh_vien_id;

            $maKhuyenMais = MaKhuyenMai::where('trang_thai', 1)
                ->where('ma_code', $request->ma)
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

    public function danhSachMaKhuyenMaiTheoSanPhamGioHang(Request $request)
    {
        try {
//            $dataApDungVi = [];
//
//            if ($request->ap_dung_vi == 1) {
//                $dataApDungVi = [0, 1];
//            } else {
//                $dataApDungVi = [0];
//            }

            $user = $request->user();
            if (!$user) {
                return response()->json(['status' => false, 'message' => 'Bạn cần đăng nhập để xem mã khuyến mãi.'], 401);
            }

            $sanPhamGioHang = DB::table('gio_hangs')
                ->join('bien_the_san_phams', 'gio_hangs.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->join('san_phams', 'bien_the_san_phams.san_pham_id', '=', 'san_phams.id')
                ->where('gio_hangs.user_id', $user->id)
                ->where('gio_hangs.chon', 1)
                ->whereNull("gio_hangs.deleted_at")
                ->select('san_phams.id as san_pham_id', 'san_phams.danh_muc_id', 'gio_hangs.so_luong', 'bien_the_san_phams.gia_khuyen_mai', 'bien_the_san_phams.gia_ban')
                ->get();

            if ($sanPhamGioHang->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Giỏ hàng của bạn đang trống.'], 400);
            }

            $tongGiaTriGioHang = $sanPhamGioHang->reduce(function ($total, $item) {
                $giaSanPham = $item->gia_khuyen_mai_tam_thoi ?? $item->gia_khuyen_mai ?? $item->gia_ban;
                return $total + ($giaSanPham * $item->so_luong);
            }, 0);

            $sanPhamIds = $sanPhamGioHang->pluck('san_pham_id')->toArray();
            $danhMucIds = $sanPhamGioHang->pluck('danh_muc_id')->unique()->toArray();

            $danhMucIdsWithSubCategories = [];
            foreach ($danhMucIds as $id) {
                $danhMucIdsWithSubCategories = array_merge($danhMucIdsWithSubCategories, $this->getDanhMucHierarchy($id));
            }
            $danhMucIdsWithSubCategories = array_unique($danhMucIdsWithSubCategories);

            $query = MaKhuyenMai::query()
                ->join('nguoi_dung_ma_khuyen_mai', 'ma_khuyen_mais.id', '=', 'nguoi_dung_ma_khuyen_mai.ma_khuyen_mai_id') // Thực hiện JOIN với bảng nguoi_dung_ma_khuyen_mai
                ->where('ma_khuyen_mais.trang_thai', 1)
                ->where('ma_khuyen_mais.ngay_bat_dau_suu_tam', '<=', now())
                ->where('ma_khuyen_mais.ngay_ket_thuc', '>=', now())
                ->whereColumn('ma_khuyen_mais.so_luong_da_su_dung', '<', 'ma_khuyen_mais.so_luong')
                ->where('nguoi_dung_ma_khuyen_mai.user_id', $user->id)
                ->where('nguoi_dung_ma_khuyen_mai.da_su_dung', 0)
                ->select('ma_khuyen_mais.*');

            if ($request->filled('ma_code')) {
                $query->where('ma_code', 'LIKE', '%' . $request->ma_code . '%');
            }

            $maKhuyenMai = $query->get()->map(function ($ma) use ($request, $sanPhamIds, $danhMucIdsWithSubCategories, $tongGiaTriGioHang) {
                $apDung = true;
                $errorMessages = [];
                $soTienGiamGia = 0;

                if ($ma->chi_tieu_toi_thieu > $tongGiaTriGioHang) {
                    $apDung = false;
                    $errorMessages[] = 'Tổng giá trị đơn hàng không đủ để áp dụng mã khuyến mãi.';
                }

                if($ma->ap_dung_vi == 1 && $request->ap_dung_vi == 0) {
                    $apDung = false;
                    $errorMessages[] = 'Mã khuyến mãi cần sử dụng ví để áp dụng';
                }

                $sanPhamKhongApDung = $ma->sanPhams()->whereIn('id', $sanPhamIds)->doesntExist();
                $danhMucKhongApDung = $ma->danhMucs()->whereIn('id', $danhMucIdsWithSubCategories)->doesntExist();

                if ($sanPhamKhongApDung && $danhMucKhongApDung) {
                    $apDung = false;
                    $errorMessages[] = 'Mã khuyến mãi không áp dụng cho sản phẩm hoặc danh mục trong giỏ hàng.';
                }

                if ($apDung) {
                    $soTienGiamGia = $ma->loai === 'phan_tram'
                        ? ($tongGiaTriGioHang * $ma->giam_gia / 100)
                        : $ma->giam_gia;

                    if ($soTienGiamGia > $tongGiaTriGioHang) {
                        $soTienGiamGia = $tongGiaTriGioHang;
                    }
                }

                return [
                    'ma_khuyen_mai' => $ma,
                    'ap_dung' => $apDung,
                    'error_messages' => $errorMessages,
                    'so_tien_giam_gia' => $apDung ? $soTienGiamGia : 0,
                ];
            });

            $maKhuyenMai = $maKhuyenMai->sortByDesc('so_tien_giam_gia')->values();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách mã khuyến mãi.',
                'data' => $maKhuyenMai
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Có lỗi xảy ra khi lấy danh sách mã khuyến mãi.', 'error' => $e->getMessage()], 500);
        }
    }

    private function getDanhMucHierarchy($id)
    {
        $danhMuc = DB::table('danh_mucs')->find($id);
        if (!$danhMuc) {
            return [];
        }
        $allDanhMucIds = [$danhMuc->id];

        $children = DB::table('danh_mucs')->where('cha_id', $danhMuc->id)->pluck('id');

        foreach ($children as $child) {
            $allDanhMucIds = array_merge($allDanhMucIds, $this->getDanhMucHierarchy($child));
        }

        return $allDanhMucIds;
    }

}
