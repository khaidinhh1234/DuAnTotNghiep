<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDonHangRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Models\DonHang;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class DonHangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $donHangs = DonHang::get();
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

    public function show($id)
    {
        try {
            $donHang = DonHang::with('chiTiets')->findOrFail($id);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $donHang->chiTiets
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
    public function updatePaymentStatus(UpdatePaymentStatusRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $donHang = DonHang::findOrFail($id);

            // Cập nhật trạng thái thanh toán bằng phương thức update()
            $donHang->update([
                'trang_thai_thanh_toan' => $request->trang_thai_thanh_toan
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái thanh toán thành công.',
                'don_hang' => $donHang
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
    public function capNhatTrangThaiDonHang(UpdateDonHangRequest $request, $id)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Tìm đơn hàng theo ID
            $donHang = DonHang::findOrFail($id);

            // Cập nhật trạng thái đơn hàng
            $donHang->update([
                'trang_thai_don_hang' => $request->input('trang_thai_don_hang'),
            ]);

            // Lưu thay đổi
            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái đơn hàng thành công.',
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
