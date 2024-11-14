<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\SendMail;
use App\Events\ThongBaoMoi;
use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\GiaoDichVi;
use App\Models\LichSuGiaoDich;
use App\Models\Momo;
use App\Models\NganHang;
use App\Models\ThongBao;
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

    public function viTaiKhoan(Request $request)
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
            if ($request->method() == 'GET') {
                if (($viUser->ma_xac_minh == "")) {
                    return response()->json([
                        'status' => false,
                        'status_code' => 400,
                    ], 400);
                } else if (isset($viUser->ma_xac_minh)) {
                    return response()->json([
                        'status' => true,
                        'status_code' => 200,
                    ], 200);
                }
            }


            if ($request->method() == 'POST') {
                $request->validate([
                    'ma_xac_minh' => 'required|string|max:6',
                ]);

                if (!Hash::check($request->ma_xac_minh, $viUser->ma_xac_minh)) {
                    return response()->json([
                        'status' => false,
                        'status_code' => 400,
                        'message' => 'Mã xác minh không chính xác',
                    ], 400);
                }

                $lichSuGiaoDich = $viUser->lichSuGiaoDichs;
                $data = [
                    'viUser' => $viUser,
                    'lichSuGiaoDich' => $lichSuGiaoDich,
                ];

                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy thông tin ví thành công',
                    'data' => $data,
                ], 200);
            }
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
            'ma_xac_minh_moi' => 'nullable|string|max:6',
        ]);
        try {
            $user = Auth::user();
            if ($user->viTien->ma_xac_minh == "") {
                $user->viTien->update([
                    'ma_xac_minh' => Hash::make($validate['ma_xac_minh']),
                ]);
                $mess = 'Thiết lập mã xác minh thành công';
            } else if (Hash::check($validate['ma_xac_minh'], $user->viTien->ma_xac_minh)) {
                $user->viTien->update([
                    'ma_xac_minh' => Hash::make($validate['ma_xac_minh_moi']),
                ]);
                $mess = 'Đổi mã xác minh thành công';
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
                'message' => $mess,
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
    public function napTienVi(Request $request)
    {
        $request->validate([
            'so_tien' => 'required|numeric',
            'ma_xac_minh' => 'required|string|max:6',
        ]);
        try {
            $user = Auth::user();
            $viUser = $user->viTien;
            $maXacMinh = $request->ma_xac_minh;
            if (Hash::check($maXacMinh, $viUser->ma_xac_minh)) {
                $giaoDichVi = GiaoDichVi::create([
                    'vi_tien_id' => $viUser->id,
                    'so_tien' => $request->so_tien,
                    'loai_giao_dich' => 'nap_tien',
                    'mo_ta' => 'Nạp tiền vào ví',
                    'thoi_gian_giao_dich' => now(),
                ]);

                // LichSuGiaoDich::create([
                //     'vi_tien_id' => $viUser->id,
                //     'so_du_truoc' => $viUser->so_du,
                //     'so_du_sau' => $viUser->so_du + $request->so_tien,
                //     'ngay_thay_doi' => now(),
                //     'mo_ta' => 'Nạp tiền vào ví',
                // ]);
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
                'message' => 'Yêu cầu nạp tiền thành công',
                'data' => $giaoDichVi,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Yêu cầu nạp tiền thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function xacNhanNapTien(Request $request)
    {
        try {
            $user = Auth::user();
            $viUser = $user->viTien;
            $trangThai = $request->resultCode ?? null;
            $maOrderMomo = $request->orderId ?? null;
            $soTien = $request->amount ?? null;
            $maDonHang = explode("-", $maOrderMomo)[0];

            $giaoDichVi = GiaoDichVi::where('ma_giao_dich', $maDonHang)->first();

            if (!isset($giaoDichVi)) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Không tìm thấy giao dịch',
                ], 404);
            }

            if ($trangThai == 0) {
                $giaoDichVi->update([
                    'trang_thai' => 'thanh_cong',
                ]);
                $giaoDichVi->viTien->update([
                    'so_du' => $giaoDichVi->viTien->so_du + $soTien,
                ]);
                LichSuGiaoDich::create([
                    'vi_tien_id' => $viUser->id,
                    'so_du_truoc' => $viUser->so_du,
                    'so_du_sau' => $viUser->so_du + $soTien,
                    'ngay_thay_doi' => now(),
                    'mo_ta' => 'Nạp tiền vào ví',
                ]);
                $thongBao = ThongBao::create([
                    'user_id' => $giaoDichVi->viTien->user_id,
                    'tieu_de' => 'Nạp tiền thành công',
                    'noi_dung' => 'Bạn đã nạp thành công ' . number_format($soTien) . ' VNĐ vào ví',
                    'loai' => 'Nạp tiền vào ví',
                    'duong_dan' => $giaoDichVi->ma_giao_dich,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);

                broadcast(new ThongBaoMoi($thongBao))->toOthers();

                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Xác nhận nạp tiền thành công',
                    'data' => $giaoDichVi,
                ], 200);
            } else {
                $trangThaiMessages = [
                    10 => 'Hệ thống đang được bảo trì.',
                    11 => 'Truy cập bị từ chối.',
                    12 => 'Phiên bản API không được hỗ trợ cho yêu cầu này.',
                    13 => 'Xác thực người bán không thành công.',
                    20 => 'Yêu cầu định dạng không đúng.',
                    21 => 'Yêu cầu bị từ chối do số tiền giao dịch không hợp lệ.',
                    22 => 'Số tiền giao dịch nằm ngoài phạm vi.',
                    40 => 'RequestId bị trùng lặp.',
                    41 => 'OrderId bị trùng lặp.',
                    42 => 'Không tìm thấy orderId hoặc orderId không hợp lệ.',
                    43 => 'Yêu cầu bị từ chối do có giao dịch tương tự đang được xử lý.',
                    45 => 'ItemId trùng lặp.',
                    47 => 'Yêu cầu bị từ chối do thông tin không áp dụng được trong tập dữ liệu có giá trị đã cho.',
                    98 => 'Mã QR này không được tạo thành công. Vui lòng thử lại sau.',
                    99 => 'Lỗi không xác định.',
                    1000 => 'Giao dịch đang được khởi tạo và chờ người dùng xác nhận.',
                    1001 => 'Giao dịch không thành công do không đủ tiền.',
                    1002 => 'Giao dịch bị từ chối bởi đơn vị phát hành phương thức thanh toán.',
                    1003 => 'Giao dịch bị hủy sau khi được xác thực thành công.',
                    1004 => 'Giao dịch không thành công vì số tiền vượt quá hạn mức thanh toán hàng ngày/hàng tháng.',
                    1005 => 'Giao dịch không thành công vì URL hoặc mã QR đã hết hạn.',
                    1006 => 'Giao dịch không thành công vì người dùng đã từ chối xác nhận thanh toán.',
                    1007 => 'Giao dịch bị từ chối do tài khoản người dùng không hoạt động hoặc không tồn tại.',
                    1017 => 'Giao dịch bị hủy bởi người bán.',
                    1026 => 'Giao dịch bị hạn chế do quy định khuyến mãi.',
                    1080 => 'Nỗ lực hoàn tiền không thành công trong quá trình xử lý. Vui lòng thử lại trong thời gian ngắn, tốt nhất là sau một giờ.',
                    1081 => 'Hoàn tiền bị từ chối. Giao dịch ban đầu có thể đã được hoàn tiền.',
                    1088 => 'Hoàn tiền bị từ chối. Giao dịch thanh toán ban đầu không đủ điều kiện để được hoàn tiền.',
                    2019 => 'Yêu cầu bị từ chối do orderGroupId không hợp lệ.',
                    4001 => 'Giao dịch bị từ chối vì tài khoản người dùng đang bị hạn chế.',
                    4002 => 'Giao dịch bị từ chối vì tài khoản người dùng chưa được C06 xác minh.',
                    4100 => 'Giao dịch không thành công vì người dùng không đăng nhập được.',
                    7000 => 'Giao dịch đang được xử lý.',
                    7002 => 'Giao dịch đang được xử lý bởi nhà cung cấp phương thức thanh toán đã chọn.',
                    9000 => 'Giao dịch đã được xác thực thành công.',
                ];

                if (array_key_exists($trangThai, $trangThaiMessages)) {
                    $giaoDichVi->update([
                        'trang_thai' => 'that_bai',
                    ]);

                    $thongBao = ThongBao::create([
                        'user_id' => $giaoDichVi->viTien->user_id,
                        'tieu_de' => 'Nạp tiền thất bại',
                        'noi_dung' => $trangThaiMessages[$trangThai],
                        'loai' => 'Nạp tiền vào ví',
                        'duong_dan' => $giaoDichVi->ma_giao_dich,
                        'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                    ]);
                    broadcast(new ThongBaoMoi($thongBao))->toOthers();
                    return response()->json([
                        'status' => false,
                        'status_code' => 400,
                        'message' => $trangThaiMessages[$trangThai],
                    ], 400);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xác nhận nạp tiền thất bại',
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
