<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\ThongBaoMoi;
use App\Exports\DonHangExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDonHangRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Models\DonHang;
use App\Models\ThongBao;
use App\Models\User;
use App\Models\VanChuyen;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class DonHangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $donHangs = DonHang::with('chiTiets', 'user')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $donHangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $donHang = DonHang::with([
                'chiTiets.bienTheSanPham.sanPham', // Lấy sản phẩm từ biến thể
                'chiTiets.bienTheSanPham.mauBienThe', // Lấy màu biến thể
                'chiTiets.bienTheSanPham.kichThuocBienThe', // Lấy kích thước biến thể
                'chiTiets.bienTheSanPham.anhBienThe', // Lấy ảnh biến thể
                'danhGias.user', // Lấy đánh giá của đơn hàng
                'vanChuyen',
                // 'user'
            ])->findOrFail($id);

            // Tính toán tổng số lượng và tổng tiền
            $tongSoLuong = $donHang->chiTiets->sum('so_luong');
            $tongTienSanPham = $donHang->chiTiets->sum('thanh_tien');

            // Chuẩn bị dữ liệu đơn hàng chi tiết với tên sản phẩm, ảnh, số lượng và giá
            $chiTietDonHang = $donHang->chiTiets->map(function ($chiTiet) {
                // Lấy các đường dẫn ảnh biến thể từ bảng anh_bien_thes
                $anhBienThe = $chiTiet->bienTheSanPham->anhBienThe->pluck('duong_dan_anh')->toArray();

                // Lấy ảnh sản phẩm (giả sử có một trường duong_dan_anh trong bảng san_phams)
                $anhSanPham = $chiTiet->bienTheSanPham->sanPham->duong_dan_anh;

                return [
                    'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                    'anh_san_pham' => $anhSanPham, // Ảnh sản phẩm
                    'anh_bien_the' => $anhBienThe, // Ảnh biến thể
                    'so_luong' => $chiTiet->so_luong,
                    'gia' => $chiTiet->gia,
                    'thanh_tien' => $chiTiet->thanh_tien,
                ];
            });

            // Lấy đánh giá của đơn hàng
            $danhGiaDonHang = $donHang->danhGia;
            $danhGiaData = null;
            if ($danhGiaDonHang) {
                $danhGiaData = [
                    'so_sao_san_pham' => $danhGiaDonHang->so_sao_san_pham,
                    'so_sao_dich_vu_van_chuyen' => $danhGiaDonHang->so_sao_dich_vu_van_chuyen,
                    'chat_luong_san_pham' => $danhGiaDonHang->chat_luong_san_pham,
                    'mo_ta' => $danhGiaDonHang->mo_ta,
                    'phan_hoi' => $danhGiaDonHang->phan_hoi,
                    'huu_ich' => $danhGiaDonHang->huu_ich
                ];
            }

            //Thong tin user

            if (
                $donHang->ten_nguoi_dat_hang == ""
                && $donHang->so_dien_thoai_nguoi_dat_hang == ""
                && $donHang->dia_chi_nguoi_dat_hang == ""
            ) {
                $thongTin = $donHang->user;
            } else {
                $thongTin = [
                    'ten_nguoi_dat_hang' => $donHang->ten_nguoi_dat_hang === "" ? ($donHang->user->ho . " " . $donHang->user->ten) : $donHang->ten_nguoi_dat_hang,
                    'so_dien_thoai_nguoi_dat_hang' => $donHang->so_dien_thoai_nguoi_dat_hang === "" ? $donHang->user->so_dien_thoai : $donHang->so_dien_thoai_nguoi_dat_hang,
                    'dia_chi_nguoi_dat_hang' => $donHang->dia_chi_nguoi_dat_hang === "" ? $donHang->user->dia_chi : $donHang->dia_chi_nguoi_dat_hang
                ];
            }

            // Chuẩn bị phản hồi với đầy đủ thông tin
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'thong_tin' => $thongTin,
                    'don_hang' => $donHang,
                    'chi_tiet_cua_don_hang' => $chiTietDonHang,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_thanh_tien_san_pham' => $tongTienSanPham,
                    'danh_gia' => $danhGiaData // Thông tin đánh giá
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy đơn hàng.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Cập nhập trạng thái thanh toán
    public function updatePaymentStatus(UpdatePaymentStatusRequest $request)
    {
        try {
            foreach ($request->id as $id) {

                DB::beginTransaction();
                $donHang = DonHang::findOrFail($id);

                // Cập nhật trạng thái thanh toán bằng phương thức update()
                $donHang->update([
                    'trang_thai_thanh_toan' => $request->trang_thai_thanh_toan
                ]);

                DB::commit();
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái thanh toán thành công.',
                // 'don_hang' => $donHang
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi thay đổi trạng thái thanh toán đơn hàng.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    // Cập nhật trạng thái đơn hàng
    public function capNhatTrangThaiDonHang(UpdateDonHangRequest $request)
    {
        try {
            DB::beginTransaction();
            $messages = [];

            foreach ($request->id as $id) {
                $donHang = DonHang::findOrFail($id);
                $shippers = User::query()->with('vaiTros')->whereHas('vaiTros', function ($query) {
                    $query->where('ten_vai_tro', 'Người giao hàng');
                })->get();

                if (in_array($donHang->trang_thai_don_hang, [DonHang::TTDH_DGH, DonHang::TTDH_CKHCN]) && $request->trang_thai_don_hang === DonHang::TTDH_DH) {
                    $messages[] = 'Không thể hủy đơn hàng khi đơn hàng đang được giao hoặc đã giao thành công.';
                    continue;
                }

                $validTransitions = [
                    DonHang::TTDH_CXH => [DonHang::TTDH_DXH, DonHang::TTDH_DH],
                    DonHang::TTDH_DXH => [DonHang::TTDH_DXL, DonHang::TTDH_DH],
                    DonHang::TTDH_DXL => [DonHang::TTDH_DGH, DonHang::TTDH_DH],
                    DonHang::TTDH_DGH => [DonHang::TTDH_CKHCN, DonHang::TTDH_DHTB],
                    DonHang::TTDH_CKHCN => [DonHang::TTDH_HTDH],
                    DonHang::TTDH_HTDH => [DonHang::TTDH_HH],
                ];

                if (!isset($validTransitions[$donHang->trang_thai_don_hang]) || !in_array($request->trang_thai_don_hang, $validTransitions[$donHang->trang_thai_don_hang])) {
                    $messages[] = 'Không thể cập nhật trạng thái ngược lại hoặc trạng thái không hợp lệ.';
                    continue;
                }

                $trangThaiCu = $donHang->trang_thai_don_hang;

                if ($trangThaiCu === $request->trang_thai_don_hang) {
                    continue;
                }

                $donHang->update(['trang_thai_don_hang' => $request->trang_thai_don_hang]);

                if ($request->trang_thai_don_hang === DonHang::TTDH_DXL) {
                    if ($shippers->isEmpty()) {
                        throw new \Exception('Không có shipper nào trong hệ thống');
                    }
                    $shipper = $shippers->sortBy(function ($shipper) {
                        return $shipper->vanChuyens->count();
                    })->first();
                    $vanChuyenData = [
                        'don_hang_id' => $donHang->id,
                        'user_id' => $donHang->user_id,
                        'shipper_id' => $shipper->id,
                        'ngay_tao' => Carbon::now(),
                        'trang_thai_van_chuyen' => VanChuyen::TTVC_CXL,
                        'cod' => $donHang->phuong_thuc_thanh_toan !== DonHang::PTTT_TT ? VanChuyen::TTCOD_KT : VanChuyen::TTCOD_CN,
                        'tien_cod' => $donHang->phuong_thuc_thanh_toan !== DonHang::PTTT_TT ? null : $donHang->tong_tien_don_hang,
                    ];
                    VanChuyen::create($vanChuyenData);
                }

                $thongBao = ThongBao::create([
                    'user_id' => $donHang->user_id,
                    'tieu_de' => 'Cập nhật trạng thái đơn hàng',
                    'noi_dung' => 'Đơn hàng #' . $donHang->ma_don_hang . ' đã được cập nhật từ trạng thái ' .
                        DonHang::getTrangThaiDonHang($trangThaiCu) . ' sang ' .
                        DonHang::getTrangThaiDonHang($request->trang_thai_don_hang),
                    'loai' => 'Đơn hàng',
                    'duong_dan' => 'don-hang',
                    'loai_duong_dan' => 'don-hang',
                    'id_duong_dan' => $donHang->id,
                ]);

                broadcast(new ThongBaoMoi($thongBao))->toOthers();
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái đơn hàng thành công.',
                'data' => $messages,
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }



    public function export()
    {
        // Tải xuống file Excel với tên 'donhang.xlsx'
        return Excel::download(new DonHangExport, 'donhang.xlsx');
    }

    public function inHoaDon(string $id)
    {
        $hoaDon = DonHang::query()->with('user', 'chiTiets')->findOrFail($id);

        if ($hoaDon) {
            $pdf = Pdf::loadView('hoadon.bill', compact('hoaDon'));
            return $pdf->download('Hoadon' . $id . '.pdf');
        }
        return response()->json([
            'status' => false,
            'status_code' => 404,
            'message' => 'Đã xảy ra lỗi khi in hóa đơn',
        ], 404);
    }

    public function layThongTinDon()
    {
        try {
            //
            $donChoXacNhan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXH)->count();
            $tongTienDonChoXacNhan = (int) DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXH)->sum('tong_tien_don_hang') ?? 0;

            //
            $donChoThanhToan = DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_CTT)->count();
            $tongTienChuaTT = (int) DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_CTT)->sum('tong_tien_don_hang') ?? 0;

            //
            $donChuaGiaoHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DXL)->count();
            $tongTienDonChuaGiao = (int) DonHang::where('trang_thai_don_hang', DonHang::TTDH_DXL)->sum('tong_tien_don_hang') ?? 0;

            //
            $donHoanHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)->count();
            $tongTienHoan = (int) DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)->sum('tong_tien_don_hang') ?? 0;
            //
            $daThanhToan = DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_DTT)->count();
            $tongTienThanhToan = (int) DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_DTT)->sum('tong_tien_don_hang') ?? 0;
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'choXacNhan' => [
                    'tong_don_cho_xac_nhan' => $donChoXacNhan,
                    'tong_tien' => $tongTienDonChoXacNhan
                ],
                'choThanhToan' =>   [
                    'tong_don_cho_thanh_toan' => $donChoThanhToan,
                    'tong_tien' => $tongTienChuaTT
                ],
                'chuaGiaoHang' =>  [
                    'tong_don_chua_giao_hang' => $donChuaGiaoHang,
                    'tong_tien' => $tongTienDonChuaGiao
                ],
                'donHoanHang' =>   [
                    'tong_don_hoan_hang' => $donHoanHang,
                    'tong_tien' => $tongTienHoan
                ],
                'donDaThanhToan' => [
                    'tong_don_da_thanh_toan' => $daThanhToan,
                    'tong_tien' => $tongTienThanhToan
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
