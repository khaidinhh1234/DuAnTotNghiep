<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
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
                'data' =>  Auth::gruard('api')->user()

            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $vanChuyen = VanChuyen::query()->with([
                'donHang.chiTiets',
                'shipper'
            ])->findOrFail($id);

            // Tính toán tổng số lượng và tổng tiền
            $tongSoLuong = $vanChuyen->donHang->chiTiets->sum('so_luong');
            $tongTienSanPham = $vanChuyen->donHang->chiTiets->sum('thanh_tien');

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'van_chuyen' => $vanChuyen,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_thanh_tien_san_pham' => $tongTienSanPham,
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
                'trang_thai_van_chuyen' => 'required',
            ]);

            DB::beginTransaction();
            foreach ($validate['id'] as $id) {
                $vanChuyen = VanChuyen::findOrFail($id);
                $validTransitions = [
                    VanChuyen::TTVC_CXL => [VanChuyen::TTVC_DGH],
                    VanChuyen::TTVC_DGH => [VanChuyen::TTVC_GHTC, VanChuyen::TTVC_GHTB],
                ];

                if (
                    !isset($validTransitions[$vanChuyen->trang_thai_van_chuyen])
                    || !in_array($validate['trang_thai_van_chuyen'], $validTransitions[$vanChuyen->trang_thai_van_chuyen])
                ) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'status_code' => 400,
                        'message' => 'Không thể cập nhật trạng thái ngược lại hoặc trạng thái không hợp lệ'
                    ], 400);
                }

                if ($vanChuyen->trang_thai_van_chuyen == VanChuyen::TTVC_DGH) {
                    if (
                        ($vanChuyen->khach_hang_xac_nhan == 0 || $vanChuyen->shipper_xac_nhan == 0)
                        && $validate['trang_thai_van_chuyen'] == VanChuyen::TTVC_GHTC
                    ) {
                        DB::rollBack();
                        return response()->json([
                            'status' => false,
                            'status_code' => 400,
                            'message' => 'Khách hàng và shipper phải xác nhận trước khi cập nhật trạng thái giao hàng thành công'
                        ], 400);
                    }
                }

                $vanChuyen->update([
                    'trang_thai_van_chuyen' => $validate['trang_thai_van_chuyen'],
                ]);

                $trangThaiDonHangMap = [
                    VanChuyen::TTVC_DGH => DonHang::TTDH_DGH,
                    VanChuyen::TTVC_GHTB => DonHang::TTDH_GHTB,
                    VanChuyen::TTVC_GHTC => DonHang::TTDH_DGTC,
                ];

                if (array_key_exists($validate['trang_thai_van_chuyen'], $trangThaiDonHangMap)) {
                    $updateData = [
                        'trang_thai_don_hang' => $trangThaiDonHangMap[$validate['trang_thai_van_chuyen']]
                    ];

                    if ($validate['trang_thai_van_chuyen'] == VanChuyen::TTVC_GHTC && ($vanChuyen->khach_hang_xac_nhan != 0 || $vanChuyen->shipper_xac_nhan != 0)) {
                        $updateData['trang_thai_thanh_toan'] = DonHang::TTTT_DTT;
                        $updateData['ngay_giao_hang_thanh_cong'] = now();
                        $vanChuyen->update([
                            'cod' =>  VanChuyen::TTCOD_DN,
                        ]);
                    }
                    $vanChuyen->donHang()->update($updateData);
                }
            }
            DB::commit();
            $mess = 'Cập nhật trạng thái vận chuyển thành công';
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => $mess,
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
    public function xacNhanVanChuyen(Request $request, $id)
    {
        try {
            $validate = $request->validate([
                'shipper_xac_nhan' => 'required',
                'anh_xac_thuc' => 'required|image',
            ]);
            DB::beginTransaction();
            $vanChuyen = VanChuyen::findOrFail($id);
            $shiper = Auth::guard('api')->id();
            if ($vanChuyen->shipper_id != $shiper) {
                DB::rollBack();
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Bạn không phải shipper của đơn hàng này'
                ], 400);
            } else {
                $vanChuyen->update([
                    'shipper_xac_nhan' => $validate['shipper_xac_nhan'],
                    'anh_xac_thuc' => $validate['anh_xac_thuc'],
                    ''
                ]);
                DB::commit();
                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Xác nhận vận chuyển thành công'
                ], 200);
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
