<?php

namespace App\Http\Controllers\Admin\Api;

use App\Exports\DonHangExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDonHangRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Models\DonHang;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;
use Maatwebsite\Excel\Facades\Excel;

class DonHangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $donHangs = DonHang::with('chiTiets')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $donHangs
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function show($id)
    // {
    //     try {
    //         $donHang = DonHang::with([
    //             'chiTiets.bienTheSanPham.sanPham', // Lấy sản phẩm từ biến thể
    //             'chiTiets.bienTheSanPham.anhBienThe', // Lấy ảnh sản phẩm
    //         ])->findOrFail($id);


    //         // Tính toán tổng số lượng và tổng tiền
    //         $tongSoLuong = $donHang->chiTiets->sum('so_luong');
    //         $tongTienSanPham = $donHang->chiTiets->sum('thanh_tien');

    //         // Chuẩn bị phản hồi với các thông tin đơn giản hơn
    //         return response()->json([
    //             'status' => true,
    //             'status_code' => 200,
    //             'data' => [
    //                 'don_hang' => [
    //                     'id' => $donHang->id,
    //                     'ghi_chu' => $donHang->ghi_chu,
    //                     'trang_thai_don_hang' => $donHang->trang_thai_don_hang,
    //                     'phuong_thuc_thanh_toan' => $donHang->phuong_thuc_thanh_toan,
    //                     'tong_tien_don_hang' => $donHang->tong_tien_don_hang,
    //                     'ten_nguoi_dat_hang' => $donHang->ten_nguoi_dat_hang,
    //                     'so_dien_thoai_nguoi_dat_hang' => $donHang->so_dien_thoai_nguoi_dat_hang,
    //                     'dia_chi_nguoi_dat_hang' => $donHang->dia_chi_nguoi_dat_hang,
    //                     'trang_thai_thanh_toan' => $donHang->trang_thai_thanh_toan,
    //                     'trang_thai_van_chuyen' => $donHang->trang_thai_van_chuyen
    //                 ],
    //                 'chi_tiet_don_hang' => $donHang->chiTiets, // Trả về trực tiếp chi tiết đơn hàng đã thêm trường
    //                 'tong_so_luong' => $tongSoLuong,
    //                 'tong_tien_san_pham' => $tongTienSanPham
    //             ]
    //         ], 200);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'status_code' => 404,
    //             'message' => 'Không tìm thấy đơn hàng.',
    //             'error' => $e->getMessage()
    //         ], 404);
    //     }
    // }
    public function show($id)
    {
        try {
            $donHang = DonHang::with([
                'chiTiets.bienTheSanPham.sanPham', // Lấy sản phẩm từ biến thể
                'chiTiets.bienTheSanPham.anhBienThe', // Lấy ảnh biến thể
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

            // Chuẩn bị phản hồi với đầy đủ thông tin
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'don_hang' => $donHang,
                    'chi_tiet_don_hang' => $chiTietDonHang,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_tien_san_pham' => $tongTienSanPham
                ]
            ], 200);

        } catch (Exception $e) {
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
            ]);
        } catch (Exception $exception) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi thay đổi trạng thái thanh toán đơn hàng.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    // Cập nhập trạng thái đơn hàng
    public function capNhatTrangThaiDonHang(UpdateDonHangRequest $request)
    {
        try {
            // Bắt đầu transaction
            foreach ($request->id as $id) {
                DB::beginTransaction();

                // Tìm đơn hàng theo ID
                $donHang = DonHang::findOrFail($id);

                if (
                    ($donHang->trang_thai_don_hang == Donhang::TTDH_DGH || $donHang->trang_thai_don_hang == DonHang::TTDH_DGTC)
                    || ($donHang->trang_thai_van_chuyen == DonHang::TTVC_DGH || $donHang->trang_thai_van_chuyen == DonHang::TTVC_GHTC)
                ) {
                    if ($request->trang_thai_don_hang == DonHang::TTDH_DH){
                        $mess = 'Không thể hủy đơn hàng khi đơn hàng đang được giao hoặc đã giao thành công.';
                    }
                } else if (
                    $donHang->trang_thai_van_chuyen == DonHang::TTVC_GHTC
                    || $donHang->trang_thai_don_hang == DonHang::TTDH_DGTC
                ) {
                    if($request->trang_thai_don_hang == DonHang::TTDH_HH){

                    }
                    $mess = 'Hoàn hàng';
                } else {
                    // Cập nhật trạng thái đơn hàng
                    $donHang->update([
                        'trang_thai_don_hang' => $request->trang_thai_don_hang,
                    ]);
                    $mess = 'Cập nhật trạng thái đơn hàng thành công.';
                }
                // Lưu thay đổi
                DB::commit();
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => $mess,
                'data' => $donHang
            ], 200);
        } catch (\Exception $exception) {
            // Rollback nếu có lỗi
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.',
                'error' => $exception->getMessage()
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
}
