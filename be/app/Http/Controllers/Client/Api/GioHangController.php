<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\GioHang;
use App\Models\BienTheSanPham;
use App\Models\MaKhuyenMai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GioHangController extends Controller
{
    public function index()
    {
        try {
            $userId = Auth::id();

            $gioHangs = DB::table('gio_hangs')
                ->join('bien_the_san_phams', 'gio_hangs.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->join('san_phams', 'bien_the_san_phams.san_pham_id', '=', 'san_phams.id')
                ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                ->leftJoin('anh_bien_thes', function($join) {
                    $join->on('bien_the_san_phams.id', '=', 'anh_bien_thes.bien_the_san_pham_id')
                        ->whereRaw('anh_bien_thes.id = (SELECT MIN(id) FROM anh_bien_thes WHERE bien_the_san_pham_id = bien_the_san_phams.id)');
                })
                ->select(
                    'gio_hangs.id',
                    'gio_hangs.user_id',
                    'gio_hangs.bien_the_san_pham_id',
                    'gio_hangs.gia',
                    'gio_hangs.gia_cu',
                    'gio_hangs.so_luong',
                    'san_phams.ten_san_pham',
                    'bien_the_san_phams.so_luong_bien_the',
//                    'bien_the_san_phams.gia_ban',
//                    'bien_the_san_phams.gia_khuyen_mai',
//                    'bien_the_san_phams.gia_khuyen_mai_tam_thoi',
                    'bien_the_mau_sacs.ten_mau_sac as mau_sac',
                    'bien_the_kich_thuocs.kich_thuoc',
                    'anh_bien_thes.duong_dan_anh as hinh_anh'
                )
                ->where('gio_hangs.user_id', $userId)
                ->get();

            $tongSoLuong = $gioHangs->sum('so_luong');

            return response()->json([
                'status' => true,
                'message' => 'Danh sách giỏ hàng đã được lấy thành công.',
                'data' => $gioHangs,
                'tong_so_luong' => $tongSoLuong
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $request->validate([
                'bien_the_san_pham_id' => 'required|exists:bien_the_san_phams,id',
                'so_luong' => 'required|integer|min:1',
            ]);

            $bienTheSanPham = BienTheSanPham::findOrFail($request->bien_the_san_pham_id);

            $gioHangHienTai = GioHang::where('user_id', Auth::id())
                ->where('bien_the_san_pham_id', $request->bien_the_san_pham_id)
                ->first();

            $soLuongHienTai = $gioHangHienTai ? $gioHangHienTai->so_luong : 0;
            $tongSoLuong = $soLuongHienTai + $request->so_luong;

            if ($tongSoLuong > $bienTheSanPham->so_luong_bien_the) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng sản phẩm vượt quá số lượng tồn kho.'
                ], 400);
            }

            if ($bienTheSanPham->gia_khuyen_mai_tam_thoi) {
                $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi;
                $giaCu = $bienTheSanPham->gia_khuyen_mai;
            } elseif ($bienTheSanPham->gia_khuyen_mai) {
                $gia = $bienTheSanPham->gia_khuyen_mai;
                $giaCu = $bienTheSanPham->gia_ban;
            } else {
                $gia = $bienTheSanPham->gia_ban;
                $giaCu = null;
            }

            $gioHang = GioHang::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'bien_the_san_pham_id' => $request->bien_the_san_pham_id,
                ],
                [
                    'so_luong' => $tongSoLuong,
                    'gia' => $gia,
                    'gia_cu' => $giaCu,
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã được thêm vào giỏ hàng thành công!',
                'data' => $gioHang
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'so_luong' => 'required|integer',
            ]);

            $gioHang = GioHang::findOrFail($id);

            if ($gioHang->user_id !== Auth::id()) {
                return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
            }

            $bienTheSanPham = BienTheSanPham::findOrFail($gioHang->bien_the_san_pham_id);
            $soLuongMoi = $gioHang->so_luong + $request->so_luong;

            if ($soLuongMoi > $bienTheSanPham->so_luong_bien_the) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng sản phẩm vượt quá số lượng tồn kho.'
                ], 400);
            }

            if ($soLuongMoi < 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng không thể nhỏ hơn 0.'
                ], 400);
            }

            $gioHang->update([
                'so_luong' => $soLuongMoi,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Giỏ hàng đã được cập nhật thành công!',
                'data' => $gioHang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }



    public function destroy($id)
    {
        try {
            $gioHang = GioHang::findOrFail($id);

            if ($gioHang->user_id !== Auth::id()) {
                return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
            }

            $gioHang->delete();

            return response()->json(['status' => true, 'message' => 'Sản phẩm đã xóa khỏi giỏ hàng']);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function syncCart(Request $request)
    {
        try {
            $cartItems = $request->input('cartItems');
            $userId = Auth::id();

            $bienTheSanPhamIds = collect($cartItems)->pluck('bien_the_san_pham_id')->toArray();
            $bienTheSanPhams = BienTheSanPham::whereIn('id', $bienTheSanPhamIds)->get()->keyBy('id');

            DB::transaction(function () use ($cartItems, $userId, $bienTheSanPhams) {
                foreach ($cartItems as $item) {
                    $bienTheSanPham = $bienTheSanPhams->get($item['bien_the_san_pham_id']);

                    if (!$bienTheSanPham || $item['so_luong'] > $bienTheSanPham->so_luong_bien_the) {
                        throw new \Exception('Số lượng sản phẩm vượt quá số lượng tồn kho.');
                    }

                    $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;

                    GioHang::updateOrCreate(
                        [
                            'user_id' => $userId,
                            'bien_the_san_pham_id' => $item['bien_the_san_pham_id'],
                        ],
                        [
                            'so_luong' => $item['so_luong'],
                            'gia' => $gia,
                        ]
                    );
                }
            });

            return response()->json([
                'status' => true,
                'message' => 'Giỏ hàng đã được đồng bộ thành công!'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function apDungMaGiamGia(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'ma_giam_gia' => 'required|string|exists:ma_khuyen_mais,ma_code',
                'san_pham_chon' => 'required|array',
                'san_pham_chon.*.gio_hang_id' => 'required|exists:gio_hangs,id',
            ]);

            $maGiamGia = MaKhuyenMai::where('ma_code', $validatedData['ma_giam_gia'])->first();

            if (!$maGiamGia || $maGiamGia->trang_thai === 0) {
                return response()->json(['status' => false, 'message' => 'Mã giảm giá không hợp lệ.'], 400);
            }

            $userId = Auth::id();
            $nguoiDungMaKhuyenMai = DB::table('nguoi_dung_ma_khuyen_mais')->where('user_id', $userId)
                ->where('ma_khuyen_mai_id', $maGiamGia->id)
                ->first();

            if (!$nguoiDungMaKhuyenMai) {
                return response()->json(['status' => false, 'message' => 'Bạn chưa lưu mã giảm giá này.'], 400);
            }

            if ($nguoiDungMaKhuyenMai->da_su_dung) {
                return response()->json(['status' => false, 'message' => 'Bạn đã sử dụng mã giảm giá này.'], 400);
            }

            $appliedDiscounts = [];

            foreach ($validatedData['san_pham_chon'] as $item) {
                $gioHangItem = GioHang::find($item['gio_hang_id']);
                $bienTheSanPham = BienTheSanPham::find($gioHangItem->bien_the_san_pham_id);

                if (!$bienTheSanPham) {
                    continue;
                }

                $isCategoryInPromotion = DB::table('khuyen_mai_danh_muc')
                    ->join('danh_mucs', 'khuyen_mai_danh_muc.danh_muc_id', '=', 'danh_mucs.id')
                    ->where('danh_mucs.id', $bienTheSanPham->danh_muc_id)
                    ->where('khuyen_mai_danh_muc.ma_khuyen_mai_id', $maGiamGia->id)
                    ->exists();

                if (!$isCategoryInPromotion) {
                    $isProductInPromotion = DB::table('khuyen_mai_san_pham')
                        ->where('san_pham_id', $bienTheSanPham->id)
                        ->where('ma_khuyen_mai_id', $maGiamGia->id)
                        ->exists();

                    if (!$isProductInPromotion) {
                        continue;
                    }
                }

                $discountAmount = $maGiamGia->loai === 'phan_tram'
                    ? ($gioHangItem->gia * $maGiamGia->giam_gia / 100)
                    : $maGiamGia->giam_gia;

                $appliedDiscounts[] = [
                    'gio_hang_id' => $gioHangItem->id,
                    'bien_the_san_pham_id' => $bienTheSanPham->id,
                    'giam_gia' => $discountAmount,
                ];
            }

            if (empty($appliedDiscounts)) {
                return response()->json(['status' => false, 'message' => 'Không có sản phẩm nào đủ điều kiện áp dụng mã giảm giá này.'], 400);
            }

            return response()->json([
                'status' => true,
                'message' => 'Mã giảm giá đã được áp dụng thành công.',
                'applied_discounts' => $appliedDiscounts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

}
