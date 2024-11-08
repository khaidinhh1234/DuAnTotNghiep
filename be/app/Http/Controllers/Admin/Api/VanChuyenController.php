<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\DonHangHoanTat;
use App\Events\ThongBaoMoi;
use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\ThongBao;
use App\Models\VanChuyen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VanChuyenController extends Controller
{
    public function index()
    {
        $auth = Auth::guard('api');;

        try {
            $query = VanChuyen::query()->with('donHang');
            if ($auth->user()->vaiTros->contains('ten_vai_tro', 'Người giao hàng')) {
                $query->where('shipper_id', $auth->id());
            }
            $vanChuyen = $query->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $vanChuyen
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách vận chuyển.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $vanChuyen = VanChuyen::query()->with([
                'donHang.chiTiets.bienTheSanPham.sanPham',
                'donHang.chiTiets.bienTheSanPham.mauBienThe',
                'donHang.chiTiets.bienTheSanPham.kichThuocBienThe',
                'donHang.chiTiets.bienTheSanPham.anhBienThe',
                'shipper',
                'donHang'
            ])->findOrFail($id);
            $vanChuyen->makeHidden(['ghi_chu']);
            $vanchuyen['ghichu'] = json_decode($vanChuyen->ghi_chu);
            // Tính toán tổng số lượng và tổng tiền
            $tongSoLuong = $vanChuyen->donHang->chiTiets->sum('so_luong');
            $tongTienSanPham = $vanChuyen->donHang->chiTiets->sum('thanh_tien');

            //Thong tin user

            if (
                $vanChuyen->donHang->ten_nguoi_dat_hang == ""
                && $vanChuyen->donHang->so_dien_thoai_nguoi_dat_hang == ""
                && $vanChuyen->donHang->dia_chi_nguoi_dat_hang == ""
            ) {
                $thongTin = $vanChuyen->donHang->user;
            } else {
                $thongTin = [
                    'ten_nguoi_dat_hang' => $vanChuyen->donHang->ten_nguoi_dat_hang === "" ? ($vanChuyen->donHang->user->ho . " " . $vanChuyen->donHang->user->ten) : $vanChuyen->donHang->ten_nguoi_dat_hang,
                    'so_dien_thoai_nguoi_dat_hang' => $vanChuyen->donHang->so_dien_thoai_nguoi_dat_hang === "" ? $vanChuyen->donHang->user->so_dien_thoai : $vanChuyen->donHang->so_dien_thoai_nguoi_dat_hang,
                    'dia_chi_nguoi_dat_hang' => $vanChuyen->donHang->dia_chi_nguoi_dat_hang === "" ? $vanChuyen->donHang->user->dia_chi : $vanChuyen->donHang->dia_chi_nguoi_dat_hang
                ];
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'thong_tin' => $thongTin,
                    'van_chuyen' => $vanChuyen,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_thanh_tien_san_pham' => $tongTienSanPham,
                    'ghi_chu' => $vanchuyen['ghichu'],
                    'anh_xac_thuc' => $vanChuyen->anh_xac_thuc
                ]
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy chi tiết vận chuyển.',
                'error' => $exception->getMessage()
            ], 404);
        }
    }
    public function capNhatTrangThaiVanChuyen(Request $request)
    {
        try {
            $validate = $request->validate([
                'id' => 'required|array',
                'trang_thai_van_chuyen' => 'required'
            ]);
            DB::beginTransaction();
            $validTransitions = [
                VanChuyen::TTVC_CXL => [VanChuyen::TTVC_DGH],
                VanChuyen::TTVC_DGH => [VanChuyen::TTVC_GHTB, VanChuyen::TTVC_GHTC],
            ];
            foreach ($validate['id'] as $id) {
                $vanChuyen = VanChuyen::findOrFail($id);
                if (
                    isset($validTransitions[$vanChuyen->trang_thai_van_chuyen])
                    && in_array($validate['trang_thai_van_chuyen'], $validTransitions[$vanChuyen->trang_thai_van_chuyen])
                ) {
                    $vanChuyen->update([
                        'trang_thai_van_chuyen' => $validate['trang_thai_van_chuyen'],
                    ]);
                }

                // $thongBao = ThongBao::create([
                //     'user_id' => $vanChuyen->donHang->user_id,
                //     'tieu_de' => 'Cập nhật trạng thái vận chuyển',
                //     'noi_dung' => 'Đơn hàng ' . $vanChuyen->donHang->ma_don_hang . ' đã được cập nhật trạng thái vận chuyển',
                //     'loai' => 'Vận chuyển',
                //     'duong_dan' => $vanChuyen->ma_van_chuyen,
                //     'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                // ]);

                // broadcast(new ThongBaoMoi($thongBao))->toOthers();
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái vận chuyển thành công',
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => $exception->getMessage()
            ]);
        }
    }
    public function xacNhanVanChuyen(Request $request, string $id)
    {
        try {
            $validate = $request->validate([
                'shipper_xac_nhan' => 'required|in:1,2',
                'anh_xac_thuc' => 'nullable|string',
                'ghi_chu' => 'nullable|array',
                'ghi_chu.*.lan1' => 'nullable|string',
                'ghi_chu.*.lan2' => 'nullable|string',
                'ghi_chu.*.lan3' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $vanChuyen = VanChuyen::findOrFail($id);
            $shipper = Auth::guard('api')->id();

            if ($vanChuyen->shipper_id != $shipper) {
                throw new \Exception('Bạn không phải shipper của đơn hàng này', 400);
            }

            if ($vanChuyen->shipper_xac_nhan == 0) {
                if ($validate['shipper_xac_nhan'] == 2) {
                    if ($vanChuyen->so_lan_giao >= 2) {
                        $vanChuyen->update([
                            'trang_thai_van_chuyen' => VanChuyen::TTVC_GHTB,
                            'shipper_xac_nhan' => $validate['shipper_xac_nhan'],
                            'ghi_chu' => json_encode($validate['ghi_chu']),
                        ]);

                        $thongBao = ThongBao::create([
                            'user_id' => $vanChuyen->user_id,
                            'tieu_de' => 'Giao hàng thất bại',
                            'noi_dung' => 'Cảm ơn bạn đã đặt hàng mã đơn hàng của bạn là: ' . $vanChuyen->ma_don_hang,
                            'loai' => 'Đơn hàng',
                            'duong_dan' => $vanChuyen->ma_don_hang,
                            'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                        ]);

                        broadcast(new ThongBaoMoi($thongBao))->toOthers();

                        DB::commit();
                        return response()->json([
                            'status' => true,
                            'status_code' => 200,
                            'message' => 'Giao hàng thất bại'
                        ], 200);
                    } else {
                        $vanChuyen->increment('so_lan_giao');
                        $vanChuyen->update([
                            'ghi_chu' => json_encode($validate['ghi_chu']),
                        ]);
                        DB::commit();
                        return response()->json([
                            'status' => true,
                            'status_code' => 200,
                            'message' => 'Giao hàng thất bại lần ' . $vanChuyen->so_lan_giao
                        ], 200);
                    }
                } elseif ($validate['shipper_xac_nhan'] == 1) {
                    $vanChuyen->update([
                        'trang_thai_van_chuyen' => VanChuyen::TTVC_GHTC,
                        'cod' => VanChuyen::TTCOD_DN,
                        'shipper_xac_nhan' => $validate['shipper_xac_nhan'],
                        'anh_xac_thuc' => $validate['anh_xac_thuc'],
                        'ngay_giao_hang_thanh_cong' => now()
                    ]);
                    $vanChuyen->donHang->update([
                        'trang_thai_thanh_toan' => DonHang::TTTT_DTT,
                        'trang_thai_don_hang' => DonHang::TTDH_CKHCN
                    ]);
                    $thongBaoGiaoHangThanhCong = new ThongBaoTelegramController();
                    $thongBaoGiaoHangThanhCong->thongBaoHoanTatGiaoHang( $vanChuyen->id);
                    DB::commit();
                    return response()->json([
                        'status' => true,
                        'status_code' => 200,
                        'message' => 'Xác nhận giao hàng thành công'
                    ], 200);
                }
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    public function layThongTinVanChuyen()
    {
        try {
            $choLayHangs = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_CXL)->count();
            $tongTienChoLayHangs = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_CXL)
                ->with('donHang')
                ->get()
                ->sum(function ($vanChuyen) {
                    return $vanChuyen->donHang ? $vanChuyen->donHang->tong_tien_don_hang : 0;
                });
            $dangGiaoHangs = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_DGH)->count();
            $tongTienDangGiaoHangs = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_DGH)
                ->with('donHang')
                ->get()
                ->sum(function ($vanChuyen) {
                    return $vanChuyen->donHang ? $vanChuyen->donHang->tong_tien_don_hang : 0;
                });
            $giaoHangThatBais = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_GHTB)->count();
            $tongTienGiaoHangThatBais = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_GHTB)
                ->with('donHang')
                ->get()
                ->sum(function ($vanChuyen) {
                    return $vanChuyen->donHang ? $vanChuyen->donHang->tong_tien_don_hang : 0;
                });
            $giaoHangThanhCongs = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_GHTC)
                ->whereHas('donHang', function ($query) {
                    $query->where('trang_thai_thanh_toan', DonHang::TTTT_DTT);
                })
                ->count();
            $tongTienGiaoHangThanhCongs = VanChuyen::where('trang_thai_van_chuyen', VanChuyen::TTVC_GHTC)
                ->whereHas('donHang', function ($query) {
                    $query->where('trang_thai_thanh_toan', DonHang::TTTT_DTT);
                })
                ->with('donHang')
                ->get()
                ->sum(function ($vanChuyen) {
                    return $vanChuyen->donHang ? $vanChuyen->donHang->tong_tien_don_hang : 0;
                });
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'choLayHang' => [
                    'tong_don_cho_lay_hang' => $choLayHangs,
                    'tong_tien' => $tongTienChoLayHangs
                ],
                'donDangGiao' => [
                    'tong_don_dang_giao_hang' => $dangGiaoHangs,
                    'tong_tien' => $tongTienDangGiaoHangs
                ],
                'giaoThatBai' => [
                    'tong_don_giao_hang_that_bai' => $giaoHangThatBais,
                    'tong_tien' => $tongTienGiaoHangThatBais
                ],
                'giaoThanhCong' => [
                    'tong_don_giao_hang_thanh_cong' => $giaoHangThanhCongs,
                    'tong_tien' => $tongTienGiaoHangThanhCongs
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin vận chuyển.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
