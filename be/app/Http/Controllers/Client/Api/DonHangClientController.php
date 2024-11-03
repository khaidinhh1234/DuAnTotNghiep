<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\HoanTatDonHang;
use App\Events\SendMail;
use App\Events\ThongBaoMoi;
use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\GiaoDichVi;
use App\Models\GioHang;
use App\Models\HoanTien;
use App\Models\MaKhuyenMai;
use App\Models\NganHang;
use App\Models\SanPham;
use App\Models\ThongBao;
use App\Models\User;
use App\Models\YeuCauRutTien;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;


class DonHangClientController extends Controller
{
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }
    public function donHangUser(Request $request) 
    {
        try {
            $user = Auth::guard('api')->user();
            
            $pageSize = $request->get('pageSize', 2);
            $donHang = DonHang::where('user_id', $user->id)->with([
                'chiTiets.bienTheSanPham.sanPham',
                'chiTiets.bienTheSanPham.mauBienThe',
                'chiTiets.bienTheSanPham.kichThuocBienThe',
                'chiTiets.bienTheSanPham.anhBienThe',
                'danhGias.user',
                'vanChuyen',
            ])->orderByDesc('created_at')->paginate($pageSize);
    
            // Thực hiện các tính toán cho từng đơn hàng
            $donHang->each(function ($item) {
                $item['tong_tien_da_giam'] = $item['tong_tien_don_hang'] - $item['so_tien_giam_gia'];
                $item['tongSoLuong'] = $item->chiTiets->sum('so_luong');
                $item['tongTienSanPham'] = $item->chiTiets->sum('thanh_tien');
            });
    
            // Xử lý dữ liệu chi tiết đơn hàng và đánh giá
            $chiTietDonHang = $donHang->flatMap(function ($order) {
                return $order->chiTiets->map(function ($chiTiet) {
                    $anhBienThe = $chiTiet->bienTheSanPham->anhBienThe->pluck('duong_dan_anh')->toArray();
                    $anhSanPham = $chiTiet->bienTheSanPham->sanPham->duong_dan_anh;
                    $gia_giam = $chiTiet->bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $chiTiet->bienTheSanPham->gia_khuyen_mai ?? $chiTiet->bienTheSanPham->gia_ban;
                    return [
                        'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                        'anh_san_pham' => $anhSanPham,
                        'anh_bien_the' => $anhBienThe,
                        'mau_bien_the' => $chiTiet->bienTheSanPham->mauBienThe->ten_mau_sac,
                        'kich_thuoc_bien_the' => $chiTiet->bienTheSanPham->kichThuocBienThe->kich_thuoc,
                        'so_luong' => $chiTiet->so_luong,
                        'gia_giam' => $gia_giam,
                        'gia' => $chiTiet->gia,
                        'thanh_tien' => $gia_giam * $chiTiet->so_luong,
                    ];
                });
            });
    
            $danhGiaDonHang = $donHang->flatMap(function ($order) {
                return $order->danhGias;
            });
    
            $danhGiaData = $danhGiaDonHang->isNotEmpty() ? $danhGiaDonHang->map(function ($danhGia) {
                return [
                    'so_sao_san_pham' => $danhGia->so_sao_san_pham,
                    'so_sao_dich_vu_van_chuyen' => $danhGia->so_sao_dich_vu_van_chuyen,
                    'chat_luong_san_pham' => $danhGia->chat_luong_san_pham,
                    'mo_ta' => $danhGia->mo_ta,
                    'phan_hoi' => $danhGia->phan_hoi,
                    'huu_ich' => $danhGia->huu_ich
                ];
            }) : null;
    
            // Tổng số lượng và tổng tiền sản phẩm
            $tongSoLuong = $donHang->sum(function ($order) {
                return $order->chiTiets->sum('so_luong');
            });
            $tongTienSanPham = $donHang->sum(function ($order) {
                return $order->chiTiets->sum('thanh_tien');
            });
    
            $data = [
                'don_hang' => $donHang->items(),
                'tong_so_luong' => $tongSoLuong,
                'tong_thanh_tien_san_pham' => $tongTienSanPham,
                'pagination' => [
                    'current_page' => $donHang->currentPage(),
                    'last_page' => $donHang->lastPage(),
                    'per_page' => $donHang->perPage(),
                    'total' => $donHang->total(),
                    'has_more_pages' => $donHang->hasMorePages(),
                ]
            ];
    
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => '',
                'error' => $e->getMessage()
            ]);
        }
    }
    
    public function donHangUserDetail(string $maDonHang)
    {
        try {
            $donHang = DonHang::query()->with([
                'chiTiets.bienTheSanPham.sanPham',
                'chiTiets.bienTheSanPham.mauBienThe',
                'chiTiets.bienTheSanPham.kichThuocBienThe',
                'chiTiets.bienTheSanPham.anhBienThe',
                'danhGias.user',
                'vanChuyen',
            ])->where('ma_don_hang', $maDonHang)->firstOrFail();

            $chiTietDonHang = $donHang->chiTiets->map(function ($chiTiet) {
                $anhBienThe = $chiTiet->bienTheSanPham->anhBienThe->pluck('duong_dan_anh')->toArray();
                $anhSanPham = $chiTiet->bienTheSanPham->sanPham->duong_dan_anh;

                return [
                    'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                    'anh_san_pham' => $anhSanPham,
                    'mau_bien_the' => $chiTiet->bienTheSanPham->mauBienThe->ten_mau_sac,
                    'kich_thuoc_bien_the' => $chiTiet->bienTheSanPham->kichThuocBienThe->kich_thuoc,
                    'anh_bien_the' => $anhBienThe,
                    'so_luong' => $chiTiet->so_luong,
                    'gia' => $chiTiet->bianTheSanPham->gia_khuyen_mai_tam_thoi ?? $chiTiet->bienTheSanPham->gia_khuyen_mai ?? $chiTiet->bienTheSanPham->gia_ban,
                    'thanh_tien' => $chiTiet->so_luong * ($chiTiet->bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $chiTiet->bienTheSanPham->gia_khuyen_mai ?? $chiTiet->bienTheSanPham->gia_ban),
                ];
            });

            $danhGiaDonHang = $donHang->danhGias->map(function ($danhGia) {
                return [
                    'so_sao_san_pham' => $danhGia->so_sao_san_pham,
                    'so_sao_dich_vu_van_chuyen' => $danhGia->so_sao_dich_vu_van_chuyen,
                    'chat_luong_san_pham' => $danhGia->chat_luong_san_pham,
                    'mo_ta' => $danhGia->mo_ta,
                    'phan_hoi' => $danhGia->phan_hoi,
                    'huu_ich' => $danhGia->huu_ich
                ];
            });

            $thongTin = [
                'ten_nguoi_dat_hang' => $donHang->ten_nguoi_dat_hang ?: ($donHang->user->ho . " " . $donHang->user->ten),
                'so_dien_thoai_nguoi_dat_hang' => $donHang->so_dien_thoai_nguoi_dat_hang ?: $donHang->user->so_dien_thoai,
                'dia_chi_nguoi_dat_hang' => $donHang->dia_chi_nguoi_dat_hang ?: $donHang->user->dia_chi
            ];

            $tongSoLuong = $donHang->chiTiets->sum('so_luong');
            $tongTienSanPham = $donHang->chiTiets->sum('thanh_tien');

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'thong_tin' => $thongTin,
                    'don_hang' => $donHang,
                    'chi_tiet_cua_don_hang' => $chiTietDonHang,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_thanh_tien_san_pham' => $tongTienSanPham,
                    'danh_gia' => $danhGiaDonHang
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy chi tiết đơn hàng thất bại',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function xacNhanDonHang(string $id)
    {
        try {
            DB::beginTransaction();
            $donHang = DonHang::query()->with('vanChuyen')->findOrFail($id);

            if ($donHang->vanChuyen->shipper_xac_nhan == 1) {
                $donHang->vanChuyen->update([
                    'khach_hang_xac_nhan' => 1
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Đơn hàng chưa được xác nhận đã giao hàng',
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xác nhận nhận hàng thành công',
                'data' => $donHang
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xác nhận nhận hàng thất bại',
                'error' => $e->getMessage()
            ]);
        }
    }
    public function taoDonHang(Request $request)
    {
        $request->validate([
            'ghi_chu' => 'nullable|string|max:255',
            'phuong_thuc_thanh_toan' => 'required|string|max:100',
            'ten_nguoi_dat_hang' => 'required|string|max:255',
            'email_nguoi_dat_hang' => 'required|email|max:255',
            'so_dien_thoai_nguoi_dat_hang' => 'required|string|max:15',
            'dia_chi_nguoi_dat_hang' => 'required|string|max:255',
            'ma_giam_gia' => 'nullable|string|max:100',
        ]);

        DB::beginTransaction();

        try {
            $userId = Auth::id();
            $sanPhamDuocChon = DB::table('gio_hangs')
                ->join('bien_the_san_phams', 'gio_hangs.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->join('san_phams', 'bien_the_san_phams.san_pham_id', '=', 'san_phams.id')
                ->where('gio_hangs.user_id', $userId)
                ->where('gio_hangs.chon', 1)
                ->whereNull("gio_hangs.deleted_at")
                ->select('san_phams.id as san_pham_id', 'bien_the_san_phams.id as bien_the_san_pham_id', 'gio_hangs.so_luong')
                ->get();

            if ($sanPhamDuocChon->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Bạn chưa chọn sản phẩm nào để mua.'], 400);
            }

            $tongTienDonHang = 0;
            $soTienGiamGia = 0;

            foreach ($sanPhamDuocChon as $sanPham) {
                $bienTheSanPham = BienTheSanPham::findOrFail($sanPham->bien_the_san_pham_id);

                if ($sanPham->so_luong > $bienTheSanPham->so_luong_bien_the) {
                    return response()->json(['status' => false, 'message' => 'Số lượng sản phẩm không hợp lệ.'], 400);
                }

                $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;
                $tongTienDonHang += $gia * $sanPham->so_luong;
            }

            if ($request->filled('ma_giam_gia')) {
                $maGiamGia = MaKhuyenMai::where('ma_code', $request->ma_giam_gia)->first();

                if ($maGiamGia) {
                    $sanPhamIds = $sanPhamDuocChon->pluck('san_pham_id')->toArray();
                    $sanPhamDanhMucIds = SanPham::whereIn('id', $sanPhamIds)->pluck('danh_muc_id')->unique()->toArray();
                    $danhMucIds = $maGiamGia->danhMucs()->pluck('id')->toArray();
                    $allDanhMucIds = $this->getAllDanhMucIds($danhMucIds);

                    if (empty($allDanhMucIds) || (empty($sanPhamDanhMucIds) || count(array_intersect($sanPhamDanhMucIds, $allDanhMucIds)) === 0)) {
                        $soTienGiamGia = 0;
                    } else {
                        if ($maGiamGia->sanPhams()->whereIn('id', $sanPhamIds)->doesntExist()) {
                            return response()->json(['status' => false, 'message' => 'Mã giảm giá không áp dụng cho sản phẩm trong giỏ hàng.'], 400);
                        }

                        $userHangThanhVienId = Auth::user()->hang_thanh_vien_id;
                        if ($maGiamGia->hangThanhViens()->where('id', $userHangThanhVienId)->doesntExist()) {
                            return response()->json(['status' => false, 'message' => 'Mã giảm giá không áp dụng cho hạng thành viên của bạn.'], 400);
                        }

                        if ($maGiamGia->user()->where('id', $userId)->doesntExist()) {
                            return response()->json(['status' => false, 'message' => 'Mã giảm giá không áp dụng cho người dùng này.'], 400);
                        }

                        $soTienGiamGia = $maGiamGia->loai === 'phan_tram'
                            ? $tongTienDonHang * ($maGiamGia->giam_gia / 100)
                            : $maGiamGia->giam_gia;

                        $daSuDung = DB::table('nguoi_dung_ma_khuyen_mai')
                            ->where('user_id', $userId)
                            ->where('ma_khuyen_mai_id', $maGiamGia->id)
                            ->where('da_su_dung', true)
                            ->exists();

                        if ($daSuDung) {
                            return response()->json(['status' => false, 'message' => 'Mã giảm giá này đã được sử dụng.'], 400);
                        } else {
                            DB::table('nguoi_dung_ma_khuyen_mai')->updateOrInsert(
                                ['user_id' => $userId, 'ma_khuyen_mai_id' => $maGiamGia->id],
                                ['da_su_dung' => true, 'ngay_su_dung' => now()]
                            );
                        }

                        $chi_tieu_toi_thieu = $maGiamGia->chi_tieu_toi_thieu ?? 0;

                        if ($tongTienDonHang < $chi_tieu_toi_thieu) {
                            return response()->json(['status' => false, 'message' => 'Tổng giá đơn hàng phải lớn hơn hoặc bằng ' . number_format($chi_tieu_toi_thieu) . ' VNĐ.'], 400);
                        }
                    }
                } else {
                    return response()->json(['status' => false, 'message' => 'Mã giảm giá không hợp lệ.'], 400);
                }
            }

            $maDonHang = 'DH' . strtoupper(uniqid());
            $donHang = DonHang::create([
                'ma_don_hang' => $maDonHang,
                'user_id' => $userId,
                'ghi_chu' => $request->ghi_chu ?? null,
                'trang_thai_don_hang' => DonHang::TTDH_CXH,
                'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                'tong_tien_don_hang' => $tongTienDonHang - $soTienGiamGia,
                'ten_nguoi_dat_hang' => $request->ten_nguoi_dat_hang,
                'so_dien_thoai_nguoi_dat_hang' => $request->so_dien_thoai_nguoi_dat_hang,
                'email_nguoi_dat_hang' => $request->email_nguoi_dat_hang,
                'dia_chi_nguoi_dat_hang' => $request->dia_chi_nguoi_dat_hang,
                'ma_giam_gia' => $request->ma_giam_gia ?? null,
                'so_tien_giam_gia' => $soTienGiamGia,
                'trang_thai_thanh_toan' => DonHang::TTTT_CTT,
            ]);

            foreach ($sanPhamDuocChon as $sanPham) {
                $bienTheSanPham = BienTheSanPham::findOrFail($sanPham->bien_the_san_pham_id);
                $soLuongMua = $sanPham->so_luong;

                $bienTheSanPham->so_luong_bien_the -= $soLuongMua;
                $bienTheSanPham->save();

                $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;

                DonHangChiTiet::create([
                    'don_hang_id' => $donHang->id,
                    'bien_the_san_pham_id' => $bienTheSanPham->id,
                    'so_luong' => $soLuongMua,
                    'gia' => $gia,
                    'thanh_tien' => $gia * $soLuongMua,
                ]);
            }

            $donHangTmp = DonHang::query()->with([
                'chiTiets',
                'chiTiets.bienTheSanPham.sanPham',
                'chiTiets.bienTheSanPham.mauBienThe',
                'chiTiets.bienTheSanPham.kichThuocBienThe',
                'chiTiets.bienTheSanPham.anhBienThe',
            ])->where('id', $donHang->id)->first();

            DB::table('gio_hangs')->where('user_id', $userId)->where('chon', 1)->update(['deleted_at' => now()]);
            $thongBao = ThongBao::create([
                'user_id' => $userId,
                'tieu_de' => 'Đơn hàng đã được đặt',
                'noi_dung' => 'Cảm ơn bạn đã đặt hàng mã đơn hàng của bạn là: ' . $donHang->ma_don_hang,
                'loai' => 'Đơn hàng',
                'duong_dan' => 'don-hang',
                'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                'id_duong_dan' => $donHang->ma_don_hang,
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();

            event(new SendMail($request->email_nguoi_dat_hang, $donHang->ten_nguoi_dat_hang, $donHangTmp));
            DB::commit();
            return response()->json(['status' => true, 'message' => 'Đặt hàng thành công.', 'data' => $donHangTmp], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
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


    public function huyDonHang(Request $request)
    {
        $request->validate([
            'ma_don_hang' => 'required|string|exists:don_hangs,ma_don_hang',
            'li_do_huy_hang' => 'required|string|max:255',
        ]);

        $userId = Auth::id();
        $maDonHang = $request->input('ma_don_hang');
        $lidoHuyHang = $request->input('li_do_huy_hang');

        DB::beginTransaction();

        try {
            $donHang = DonHang::where('ma_don_hang', $maDonHang)
                ->where('user_id', $userId)
                ->whereIn('trang_thai_don_hang', [DonHang::TTDH_CXH, DonHang::TTDH_DXH])
                ->first();

            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại hoặc không thể hủy.',
                ], 400);
            }
            $donHang->li_do_huy_hang = $lidoHuyHang;
            $donHang->trang_thai_don_hang = DonHang::TTDH_DH;
            $donHang->save();

            foreach ($donHang->chiTiets as $chiTiet) {
                $bienTheSanPham = BienTheSanPham::find($chiTiet->bien_the_san_pham_id);
                if ($bienTheSanPham) {
                    $bienTheSanPham->so_luong_bien_the += $chiTiet->so_luong;
                    $bienTheSanPham->save();

                    $gioHangItem = DB::table('gio_hangs')
                        ->where('user_id', $userId)
                        ->where('bien_the_san_pham_id', $chiTiet->bien_the_san_pham_id)
                        ->whereNull('deleted_at')
                        ->first();

                    if ($gioHangItem) {
                        DB::table('gio_hangs')
                            ->where('user_id', $userId)
                            ->where('bien_the_san_pham_id', $chiTiet->bien_the_san_pham_id)
                            ->update([
                                'so_luong' => $gioHangItem->so_luong + $chiTiet->so_luong,
                                'deleted_at' => null, // Khôi phục trạng thái giỏ hàng
                            ]);

                        DB::table('gio_hangs')
                            ->where('user_id', $userId)
                            ->where('bien_the_san_pham_id', $chiTiet->bien_the_san_pham_id)
                            ->where('id', '!=', $gioHangItem->id) // Giữ lại bản ghi hiện tại
                            ->delete();
                    } else {
                        DB::table('gio_hangs')->insert([
                            'user_id' => $userId,
                            'bien_the_san_pham_id' => $chiTiet->bien_the_san_pham_id,
                            'so_luong' => $chiTiet->so_luong,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
            $thongBao = ThongBao::create([
                'user_id' => $userId,
                'tieu_de' => 'Đơn hàng đã hủy',
                'noi_dung' => 'Đơn hàng mã ' . $donHang->ma_don_hang . ' của bạn đã được hủy.',
                'loai' => 'Đơn hàng',
                'duong_dan' => 'don-hang',
                'hinh_thu_nho' => 'https://path-to-thumbnail-image.png',
                'id_duong_dan' => $donHang->id,
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Đơn hàng đã được hủy thành công.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi khi hủy đơn hàng.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function hoanDonHang(Request $request, $ma_don_hang)
    {
        $validated = $request->validate([
            'ly_do_hoan_don' => 'required|string|max:255',
        ]);

        $userId = Auth::id();
        DB::beginTransaction();
        try {
            $donHang = DonHang::where('ma_don_hang', $ma_don_hang)
                ->where('user_id', $userId)
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->first();
            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại hoặc không thể hoàn hàng.',
                ], 400);
            }
            $viTienId = User::find($userId)->viTien->id;
            $giaoDichVi = GiaoDichVi::create([
                'vi_tien_id' => $viTienId,
                'loai_giao_dich' => 'hoan_tien',
                'so_tien' => $donHang->tong_tien_don_hang,
                'mo_ta' => 'Hoàn tiền đơn hàng ' . $donHang->ma_don_hang,
                'trang_thai' => 'dang_xu_ly',
                'thoi_gian_giao_dich' => now(),
            ]);

            HoanTien::create([
                'giao_dich_vi_id' => $giaoDichVi->id,
                'don_hang_id' => $donHang->id,
                'so_tien_hoan' => $donHang->tong_tien_don_hang,
                'ly_do' => $validated['ly_do_hoan_don'],
                'thoi_gian_hoan' => now(),
            ]);

            $thongBao = ThongBao::create([
                'user_id' => $userId,
                'tieu_de' => 'Đơn hàng đã hoàn',
                'noi_dung' => 'Đơn hàng mã ' . $donHang->ma_don_hang . ' của bạn đã được hoàn.',
                'loai' => 'Đơn hàng',
                'duong_dan' => 'don-hang',
                'hinh_thu_nho' => 'https://path-to-thumbnail-image.png',
                'id_duong_dan' => $donHang->id,
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Yêu cầu hoàn hàng đã thành công.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi khi hoàn đơn hàng.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function yeuCauRutTien(Request $request, $id)
    {
        $request->validate([
            'so_tien' => 'required|numeric|min:1',
            'ma_xac_minh' => 'required|string|min:6|max:6',
        ]);

        $userId = Auth::id();
        $user = User::findOrFail($userId);
        $viTien = $user->viTien;

        if (!$viTien) {
            return response()->json([
                'status' => false,
                'message' => 'Ví tiền không tồn tại.',
            ], 400);
        }
        $maXacThuc = $request->input('ma_xac_minh');
        $soTien = $request->input('so_tien');
        $nganHangId = $id;
        DB::beginTransaction();

        try {
            $user = User::findOrFail($userId);
            if (Hash::check($maXacThuc, $user->viTien->ma_xac_minh)) {
                if ($user->viTien->so_du < $soTien) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Số dư trong ví tiền không đủ để rút.',
                    ], 400);
                }
                $yeuCauRutTien = YeuCauRutTien::create([
                    'vi_tien_id' => $viTien->id,
                    'ngan_hang_id' => $nganHangId,
                    'so_tien' => (int)$soTien,
                    'trang_thai' => 'cho_duyet',
                ]);

                $user->viTien->so_du -= $soTien;
                $user->viTien->save();

                GiaoDichVi::create([
                    'vi_tien_id' => $user->viTien->id,
                    'loai_giao_dich' => 'rut_tien',
                    'so_tien' => $soTien,
                    'mo_ta' => 'Rút tiền từ ví tiền',
                    'trang_thai' => 'dang_xu_ly',
                    'thoi_gian_giao_dich' => now(),
                ]);

                // $thongBao = ThongBao::create([
                //     'user_id' => $userId,
                //     'tieu_de' => 'Yêu cầu rút tiền',
                //     'noi_dung' => 'Yêu cầu rút tiền của bạn đã được gửi.',
                //     'loai' => 'Rút tiền',
                //     'duong_dan' => 'rut-tien',
                //     'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                //     'id_duong_dan' => $yeuCauRutTien->id,
                // ]);

                // broadcast(new ThongBaoMoi($thongBao))->toOthers();
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Mã xác thực không chính xác.',
                ], 400);
            }

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Yêu cầu rút tiền đã được gửi.',
                'data' => $yeuCauRutTien,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Đã xảy ra lỗi khi gửi yêu cầu rút tiền.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
