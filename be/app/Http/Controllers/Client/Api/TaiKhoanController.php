<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\SendMail;
use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\LichSuGiaoDich;
use App\Models\Momo;
use App\Models\NganHang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class TaiKhoanController extends Controller
{
    public function CapNhatThongTin(Request $request)
    {
        $validateData = $request->validate([
            'ho' => 'nullable|string',
            'ten' => 'nullable|string',
            'anh_nguoi_dung' => 'nullable|string',
            'so_dien_thoai' => 'nullable|string',
            'dia_chi' => 'nullable|string',
            'ngay_sinh' => 'nullable|date',
            'gioi_tinh' => 'nullable|in:0,1,2',
        ]);

        $userId = Auth::guard('api')->user()->id;
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        } else {
            $user->update($validateData);
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật thông tin thành công',
                'data' => $user,
            ], 200);
        }
    }

    public function viTaiKhoan()
    {
        try {
            $userID = Auth::id();
            $user = User::find($userID);
            $viUser = $user->viTien;
            if (!$viUser) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Người dùng chưa có ví tiền',
                ], 404);
            }
            $lichSuGiaoDich = $viUser->lichSuGiaoDichs;
            $data = [
                'viUser' => $viUser,
                'lichSuGiaoDich' => $lichSuGiaoDich,
                'trang_thai_ma_xac_minh' => $viUser->ma_xac_minh ? true : false,
            ];
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy thông tin ví thành công',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi không xác định',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function themTaiKhoanNganHang(Request $request)
    {
        $validate = $request->validate([
            'tai_khoan_ngan_hang' => 'required|string|max:255',
            'ten_chu_tai_khoan' => 'required|string|max:255',
            'ngan_hang' => 'required|string|max:255',
            'logo_ngan_hang' => 'required|string|max:255',
            'ma_xac_minh' => 'required|string|max:6',
        ]);
        try {
            $userId = Auth::id();
            $user = User::find($userId);
            $maXacMinh = $validate['ma_xac_minh'];
            if (Hash::check($maXacMinh, $user->viTien->ma_xac_minh)) {
                $nganHang = NganHang::firstOrCreate(
                    [
                        'user_id' => $userId,
                        'tai_khoan_ngan_hang' => $validate['tai_khoan_ngan_hang'],
                        'ten_chu_tai_khoan' => $validate['ten_chu_tai_khoan'],
                        'ngan_hang' => $validate['ngan_hang'],
                        'logo_ngan_hang' => $validate['logo_ngan_hang'],
                    ],
                    [
                        'user_id' => $userId,
                        'ngan_hang' => $validate['ngan_hang'],
                        'tai_khoan_ngan_hang' => $validate['tai_khoan_ngan_hang'],
                        'ten_chu_tai_khoan' => $validate['ten_chu_tai_khoan'],
                        'logo_ngan_hang' => $validate['logo_ngan_hang'],
                    ]
                );
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Mã xác minh không chính xác',
                ], 400);
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Thêm tài khoản ngân hàng thành công',
                'data' => $nganHang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Thêm tài khoản ngân hàng thất bại',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function nganHangUser()
    {
        try {
            $user = Auth::user();
            $nganHang = $user->nganHang;
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy thông tin ngân hàng thành công',
                'data' => $nganHang,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin ngân hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function huyLienKetNganHang(Request $request, $id)
    {
        $request->validate([
            'ma_xac_minh' => 'required|string|max:6',
        ]);
        try {
            $user = Auth::user();
            $maXacMinh = $request->ma_xac_minh;
            $nganHang = $user->nganHang->find($id);
            if (!$nganHang) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Không tìm thấy ngân hàng',
                ], 404);
            }
            if (Hash::check($maXacMinh, $user->viTien->ma_xac_minh)) {
                $nganHang->delete();
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Mã xác minh không chính xác',
                ], 400);
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Hủy liên kết ngân hàng thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi hủy liên kết ngân hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function thietLapMaXacMinh(Request $request)
    {
        $validate = $request->validate([
            'ma_xac_minh' => 'required|string|max:6',
        ]);
        try {
            $user = Auth::user();
            if (!isset($user->viTien->ma_xac_minh) || Hash::check($validate['ma_xac_minh'], $user->viTien->ma_xac_minh)) {
                $user->viTien->update([
                    'ma_xac_minh' => $validate['ma_xac_minh'],
                ]);
            }

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Thiết lập mã xác minh thành công',
                'data' => $user->viTien,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi thiết lập mã xác minh',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function quenMaXacMinh()
    {
        try {
            $user = Auth::user();
            $email = $user->email;
            $name = $user->ho . ' ' . $user->ten;
            event(new SendMail($email, $name, 'forgotMaXacMinh'));

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Gửi mã xác minh thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi đổi mã xác minh',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getTransactionHistory(Request $request)
    {
        // Lấy user đang đăng nhập
        $user = $request->user();

        // Lấy ra tất cả đơn hàng của user
        $userOrders = DonHang::where('user_id', $user->id)->pluck('ma_don_hang')->toArray();

        // Lấy ra các giao dịch tương ứng với các orderId trong bảng Momo
        $transactions = Momo::with('donHang')
            ->whereIn('orderId', $userOrders)->get();

        // Kiểm tra xem có giao dịch nào không
        if ($transactions->isEmpty()) {
            return response()->json([
                'message' => 'Không có giao dịch nào cho đơn hàng của bạn.',
                'data' => []
            ], 404);
        }

        // Trả về dữ liệu giao dịch
        return response()->json([
            'message' => 'Lịch sử giao dịch.',
            'data' => $transactions
        ]);
    }

}
