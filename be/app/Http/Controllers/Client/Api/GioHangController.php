<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\GioHang;
use App\Models\BienTheSanPham;
use App\Models\MaKhuyenMai;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
                ->where('gio_hangs.user_id', $userId)
                ->whereNull("gio_hangs.deleted_at")
                ->select(
                    'gio_hangs.id',
                    'gio_hangs.bien_the_san_pham_id',
                    'gio_hangs.so_luong',
                    'gio_hangs.het_hang',
                    'gio_hangs.chon',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.trang_thai',
                    'bien_the_san_phams.so_luong_bien_the as kho_hang',
                    'bien_the_san_phams.gia_ban',
                    'bien_the_san_phams.gia_khuyen_mai',
                    'bien_the_san_phams.gia_khuyen_mai_tam_thoi',
                    'bien_the_mau_sacs.ten_mau_sac as mau_sac',
                    'bien_the_kich_thuocs.kich_thuoc',
                    'san_phams.deleted_at as ngay_xoa',
                )
                ->orderBy('gio_hangs.created_at', 'desc')
                ->get();

            $messages = [];

            $gioHangs->transform(function ($item) use (&$messages) {
                if ($item->kho_hang === 0) {
                    if ($item->het_hang === 0) {
                        DB::table('gio_hangs')->where('id', $item->id)->update(['chon' => 0, 'het_hang' => 1]);
                        $messages[] = "Sản phẩm '{$item->ten_san_pham}' đã hết hàng.";
                    }
                } else {
                    if ($item->het_hang === 1) {
                        DB::table('gio_hangs')->where('id', $item->id)->update(['het_hang' => 0, 'chon' => 1]);
                        $messages[] = "Sản phẩm '{$item->ten_san_pham}' đã có hàng trở lại.";
                    }
                    if ($item->so_luong > $item->kho_hang) {
                        $messages[] = "Sản phẩm '{$item->ten_san_pham}' đã được cập nhật số lượng vì vượt quá kho.";
                        $item->so_luong = $item->kho_hang;

                        DB::table('gio_hangs')->where('id', $item->id)->update(['so_luong' => $item->kho_hang]);
                    }
                }

                $bienThe = BienTheSanPham::with(['anhBienThe' => function ($query) {
                    $query->first();
                }])->find($item->bien_the_san_pham_id);

                $item->hinh_anh = optional($bienThe->anhBienThe->first())->duong_dan_anh;
                $item->gia_hien_tai = $item->gia_ban;
                $item->gia_cu = $item->gia_ban;

                if (!is_null($item->gia_khuyen_mai_tam_thoi) && $item->gia_khuyen_mai_tam_thoi > 0) {
                    $item->gia_hien_tai = $item->gia_khuyen_mai_tam_thoi;
                } elseif (!is_null($item->gia_khuyen_mai) && $item->gia_khuyen_mai > 0) {
                    $item->gia_hien_tai = $item->gia_khuyen_mai;
                }

                return $item;
            });

            $sanPhamGiamGia = $gioHangs->filter(function ($item) {
                return $item->het_hang === 0 && isset($item->gia_cu) && $item->gia_hien_tai < $item->gia_cu
                    && $item->trang_thai == 1 && $item->ngay_xoa == null;
            })->map(function ($item) {
                $item->tiet_kiem = ($item->gia_cu - $item->gia_hien_tai) * $item->so_luong;
                return $item;
            });

            $sanPhamNguyenGia = $gioHangs->filter(function ($item) {
                return is_null($item->gia_khuyen_mai) && is_null($item->gia_khuyen_mai_tam_thoi)
                    && $item->het_hang === 0 && $item->trang_thai == 1 && $item->ngay_xoa == null;
            });

            $sanPhamHetHang = $gioHangs->filter(function ($item) {
                return $item->het_hang === 1 && $item->trang_thai == 1 && $item->ngay_xoa == null;
            });

            $sanPhamKhongHoatDong = $gioHangs->filter(function ($item) {
                if ($item->trang_thai == 0 || $item->ngay_xoa != null) {
                    if ($item->chon === 1) {
                        DB::table('gio_hangs')->where('id', $item->id)->update(['chon' => 0]);
                    }
                }
                return $item->trang_thai == 0 || $item->ngay_xoa != null;
            });



            $tongSoLuong = $gioHangs->sum('so_luong');

            return response()->json([
                'status' => true,
                'message' => 'Danh sách giỏ hàng đã được lấy thành công.',
                'san_pham_giam_gia' => $sanPhamGiamGia->values(),
                'san_pham_nguyen_gia' => $sanPhamNguyenGia->values(),
                'san_pham_het_hang' => $sanPhamHetHang->values(),
                'san_pham_khong_hoat_dong' => $sanPhamKhongHoatDong->values(),
                'tong_so_luong' => $tongSoLuong,
                'thong_bao' => $messages,
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

            if (Auth::user()->vaiTros()->whereNot('ten_vai_tro', 'Khách hàng')->exists()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể thêm sản phẩm vào giỏ hàng.'
                ]);
            }

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

            $gioHang = GioHang::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'bien_the_san_pham_id' => $request->bien_the_san_pham_id,
                    'chon' => 1
                ],
                [
                    'so_luong' => $tongSoLuong,
                    'chon' => 1
                ]
            );

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã thêm vào giỏ hàng',
                'data' => $gioHang
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function tangSoLuong($id)
    {
        try {
            $gioHang = GioHang::findOrFail($id);

            if ($gioHang->user_id != Auth::id()) {
                return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
            }

            $bienTheSanPham = BienTheSanPham::findOrFail($gioHang->bien_the_san_pham_id);

            if ($gioHang->so_luong + 1 > $bienTheSanPham->so_luong_bien_the) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng sản phẩm vượt quá số lượng tồn kho.'
                ], 400);
            }

            $gioHang->increment('so_luong');

            return response()->json([
                'status' => true,
                'message' => 'Đã tăng số lượng sản phẩm thành công!',
                'data' => $gioHang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function giamSoLuong($id)
    {
        try {
            $gioHang = GioHang::findOrFail($id);

            if ($gioHang->user_id != Auth::id()) {
                return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
            }

            if ($gioHang->so_luong - 1 < 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng không thể nhỏ hơn 1.'
                ], 400);
            }

            $gioHang->decrement('so_luong');

            return response()->json([
                'status' => true,
                'message' => 'Đã giảm số lượng sản phẩm thành công!',
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

            if ($gioHang->user_id != Auth::id()) {
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

    private function getAllDanhMucIds($danhMucIds)
    {
        $allIds = collect($danhMucIds);

        foreach ($danhMucIds as $danhMucId) {
            $children = DB::table('danh_mucs')->where('cha_id', $danhMucId)->pluck('id')->toArray();
            if (!empty($children)) {
                $allIds = $allIds->merge($this->getAllDanhMucIds($children));
            }
        }

        return $allIds->unique()->toArray();
    }

    public function apDungMaGiamGia(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'ma_giam_gia' => 'required|string|exists:ma_khuyen_mais,ma_code',
            ]);

            $maGiamGia = MaKhuyenMai::where('ma_code', $validatedData['ma_giam_gia'])->first();

            if (!$maGiamGia || $maGiamGia->trang_thai === 0) {
                return response()->json(['status' => false, 'message' => 'Mã giảm giá không hợp lệ.'], 400);
            }

            $userId = Auth::id();

            $sanPhamTrongGioHang = DB::table('gio_hangs')
                ->where('user_id', $userId)
                ->whereNull('deleted_at')
                ->select('id as gio_hang_id', 'bien_the_san_pham_id', 'so_luong')
                ->get();

            if ($sanPhamTrongGioHang->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có sản phẩm nào trong giỏ hàng.',
                ], 400);
            }

            $nguoiDungMaKhuyenMai = DB::table('nguoi_dung_ma_khuyen_mai')
                ->where('user_id', $userId)
                ->where('ma_khuyen_mai_id', $maGiamGia->id)
                ->first();

            if (!$nguoiDungMaKhuyenMai) {
                DB::table('nguoi_dung_ma_khuyen_mai')->insert([
                    'user_id' => $userId,
                    'ma_khuyen_mai_id' => $maGiamGia->id,
                    'da_su_dung' => false,
                    'ngay_su_dung' => null,
                ]);
            } else if ($nguoiDungMaKhuyenMai->da_su_dung) {
                return response()->json(['status' => false, 'message' => 'Bạn đã sử dụng mã giảm giá này.'], 400);
            }

            $tongGiaTriGioHang = 0;

            $danhMucIds = $maGiamGia->danhMucs()->pluck('id')->toArray();
            $allDanhMucIds = $this->getAllDanhMucIds($danhMucIds);
            $sanPhamIds = $maGiamGia->sanPhams()->pluck('id')->toArray();

            foreach ($sanPhamTrongGioHang as $gioHangItem) {
                $bienTheSanPham = BienTheSanPham::find($gioHangItem->bien_the_san_pham_id);

                if (!$bienTheSanPham) {
                    continue;
                }

                $sanPhamId = $bienTheSanPham->san_pham_id;

                $giaApDung = $bienTheSanPham->gia_khuyen_mai_tam_thoi
                    ?? $bienTheSanPham->gia_khuyen_mai
                    ?? $bienTheSanPham->gia_ban;

                if (empty($allDanhMucIds) && empty($sanPhamIds)) {
                    $tongGiaTriGioHang += $giaApDung * $gioHangItem->so_luong;
                } else {
                    $sanPham = DB::table('san_phams')
                        ->where('id', $sanPhamId)
                        ->where(function ($query) use ($allDanhMucIds, $sanPhamIds) {
                            $query->whereIn('danh_muc_id', $allDanhMucIds)
                                ->orWhereIn('id', $sanPhamIds);
                        })
                        ->first();

                    if ($sanPham) {
                        $tongGiaTriGioHang += $giaApDung * $gioHangItem->so_luong;
                    }
                }
            }

            if ($tongGiaTriGioHang == 0) {
                return response()->json(['status' => false, 'message' => 'Giỏ hàng trống hoặc không có sản phẩm áp dụng mã giảm giá.'], 400);
            }

            if ($maGiamGia->chi_tieu_toi_thieu && $tongGiaTriGioHang < $maGiamGia->chi_tieu_toi_thieu) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tổng giá trị giỏ hàng chưa đạt mức chi tiêu tối thiểu để áp dụng mã giảm giá.',
                ], 400);
            }

            $soTienGiamGia = $maGiamGia->loai === 'phan_tram'
                ? min($tongGiaTriGioHang * $maGiamGia->giam_gia / 100, $maGiamGia->giam_toi_da)
                : $maGiamGia->giam_gia;

            if ($soTienGiamGia > $tongGiaTriGioHang) {
                $soTienGiamGia = $tongGiaTriGioHang;
            }

            return response()->json([
                'status' => true,
                'message' => 'Mã giảm giá đã được áp dụng thành công.',
                'tong_gia_tri_gio_hang' => $tongGiaTriGioHang,
                'so_tien_giam_gia' => $soTienGiamGia,
                'tong_gia_tri_sau_giam' => $tongGiaTriGioHang - $soTienGiamGia,
                'ap_dung_ma_giam_gia' => [
                    'ma_giam_gia' => $validatedData['ma_giam_gia'],
                    'so_tien_giam_gia' => $soTienGiamGia,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateSelection(Request $request)
    {
        try {
            $userId = Auth::id();
            $gioHangIds = $request->input('gio_hang_ids');
            $isSelected = $request->input('chon');

            if (!is_array($gioHangIds) || empty($gioHangIds)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vui lòng cung cấp ít nhất một ID giỏ hàng.',
                ], 400);
            }

            $gioHangs = DB::table('gio_hangs')
                ->whereIn('id', $gioHangIds)
                ->where('user_id', $userId)
                ->get();

            if ($gioHangs->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có sản phẩm nào tồn tại trong giỏ hàng.',
                ], 404);
            }

            DB::table('gio_hangs')
                ->whereIn('id', $gioHangIds)
                ->where('user_id', $userId)
                ->update(['chon' => $isSelected]);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật trạng thái chọn thành công.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function calculateTotal(Request $request)
    {
        try {
            $userId = Auth::id();

            $gioHangs = DB::table('gio_hangs')
                ->join('bien_the_san_phams', 'gio_hangs.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->join('san_phams', 'bien_the_san_phams.san_pham_id', '=', 'san_phams.id')
                ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                ->leftJoin('anh_bien_thes', function ($join) {
                    $join->on('bien_the_san_phams.id', '=', 'anh_bien_thes.bien_the_san_pham_id')
                        ->whereRaw('anh_bien_thes.id = (SELECT MIN(id) FROM anh_bien_thes WHERE bien_the_san_pham_id = bien_the_san_phams.id)');
                })
                ->select(
                    'gio_hangs.id',
                    'gio_hangs.bien_the_san_pham_id',
                    'gio_hangs.so_luong',
                    'gio_hangs.chon',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'bien_the_san_phams.so_luong_bien_the as kho_hang',
                    'bien_the_san_phams.gia_ban',
                    'bien_the_san_phams.gia_khuyen_mai',
                    'bien_the_san_phams.gia_khuyen_mai_tam_thoi',
                    'bien_the_mau_sacs.ten_mau_sac as mau_sac',
                    'bien_the_kich_thuocs.kich_thuoc',
                    'anh_bien_thes.duong_dan_anh as hinh_anh'
                )
                ->where("gio_hangs.deleted_at", null)
                ->where('gio_hangs.user_id', $userId)
                ->where('gio_hangs.chon', 1)
                ->get();

            $tongGiaTriSanPham = 0;
            $tongTietKiem = 0;

            $gioHangs->transform(function ($item) use (&$tongGiaTriSanPham, &$tongTietKiem) {
                if ($item->kho_hang === 0) {
                    $item->het_hang = true;
                    $item->chon = false;
                    $messages[] = "Sản phẩm '{$item->ten_san_pham}' đã hết hàng.";

                    DB::table('gio_hangs')
                        ->where('id', $item->id)
                        ->update(['chon' => false, 'het_hang' => true]);

                    return $item;
                } else {
                    $item->het_hang = false;
                }

                $item->gia_hien_tai = $item->gia_ban;
                $item->gia_cu = null;
                $item->tiet_kiem = 0;

                if (isset($item->gia_khuyen_mai_tam_thoi) && $item->gia_khuyen_mai_tam_thoi) {
                    $item->gia_hien_tai = $item->gia_khuyen_mai_tam_thoi;
                    $item->gia_cu = $item->gia_khuyen_mai;
                } elseif (isset($item->gia_khuyen_mai) && $item->gia_khuyen_mai) {
                    $item->gia_hien_tai = $item->gia_khuyen_mai;
                    $item->gia_cu = $item->gia_ban;
                }

                if (isset($item->gia_cu) && $item->gia_hien_tai < $item->gia_cu) {
                    $item->tiet_kiem = ($item->gia_cu - $item->gia_hien_tai) * $item->so_luong;
                    $tongTietKiem += $item->tiet_kiem;
                }

                $tongGiaTriSanPham += $item->gia_hien_tai * $item->so_luong;

                return $item;
            });

            $vanChuyen = 20000;
            $giamGiaVanChuyen = 0;

            if ($tongGiaTriSanPham > 500000) {
                $giamGiaVanChuyen = $vanChuyen;
            }

            $tongThanhToan = $tongGiaTriSanPham + $vanChuyen - $giamGiaVanChuyen;
            return response()->json([
                'status' => true,
                'message' => 'Tính tổng giá trị đơn hàng thành công.',
                'chi_tiet_don_hang' => [
                    'san_pham' => $gioHangs,
                    'tong_gia_tri_san_pham' => $tongGiaTriSanPham,
                    'tong_tiet_kiem' => $tongTietKiem,
                    'van_chuyen' => $vanChuyen,
                    'giam_gia_van_chuyen' => -$giamGiaVanChuyen,
                    'tong_thanh_toan' => $tongThanhToan,
                    'tiet_kiem' => $tongTietKiem + $giamGiaVanChuyen,
                ],
            ]);
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
                'so_luong' => 'required|integer|min:1',
            ]);
            $gioHang = GioHang::findOrFail($id);
            if ($gioHang->user_id != Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            $bienTheSanPham = BienTheSanPham::findOrFail($gioHang->bien_the_san_pham_id);
            if ($request->so_luong > $bienTheSanPham->so_luong_bien_the) {
                return response()->json([
                    'message' => "Rất tiếc, bạn chỉ có thể mua tối đa $bienTheSanPham->so_luong_bien_the sản phẩm."
                ], 400);
            }
            $gioHang->update([
                'so_luong' => $request->so_luong,
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Đã thay đổi số lượng sản phẩm thành công!',
                'data' => $gioHang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
}
