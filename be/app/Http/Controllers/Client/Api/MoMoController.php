<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\SendMail;
use App\Events\ThongBaoMoi;
use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\LichSuGiaoDich;
use App\Models\Momo;
use App\Models\ThongBao;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Nette\Utils\Random;

class MoMoController extends Controller
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
    public function thanhToanOnlineMomo(Request $request)
    {
        if ($request->phuong_thuc_thanh_toan == DonHang::PTTT_MM_ATM) {
            $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
            $partnerCode = env('MOMO_PARTNER_CODE');
            $accessKey = env('MOMO_ACCESS_KEY');
            $secretKey = env('MOMO_SECRET_KEY');

            $orderInfo = "Thanh toán qua MoMo";
            $amount = $request->amount;
            if (isset($request->ma_don_hang)) {
                $orderId = $request->ma_don_hang . '-' . random_int(100000, 999999);
                $redirectUrl = env('MOMO_REDIRECT_URL');
                $ipnUrl = env('MOMO_IPN_URL');
            } elseif (isset($request->ma_giao_dich)) {
                $orderId = $request->ma_giao_dich . '-' . random_int(100000, 999999);
                $redirectUrl = env('MOMO_REDIRECT_VT_URL');
                $ipnUrl = env('MOMO_IPN_VT_URL');
            }


            $extraData = "";

            $requestId = time() . "";
            $requestType = "payWithATM";

            $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType";
            $signature = hash_hmac("sha256", $rawHash, $secretKey);

            $data = [
                'partnerCode' => $partnerCode,
                'partnerName' => "Test",
                "storeId" => "MomoTestStore",
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            ];

            $result = $this->execPostRequest($endpoint, json_encode($data));
            $jsonResult = json_decode($result, true);

            if (isset($jsonResult['payUrl'])) {
                return response()->json(['payUrl' => $jsonResult['payUrl']]);
            } else {
                return response()->json(['message' => 'Không tạo được URL thanh toán'], 500);
            }
        } elseif ($request->phuong_thuc_thanh_toan == DonHang::PTTT_MM_QR) {
            $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
            $partnerCode = env('MOMO_PARTNER_CODE');
            $accessKey = env('MOMO_ACCESS_KEY');
            $secretKey = env('MOMO_SECRET_KEY');

            $orderInfo = "Thanh toán qua MoMo";
            $amount = $request->amount;
            if (isset($request->ma_don_hang)) {
                $orderId = $request->ma_don_hang . '-' . random_int(100000, 999999);
                $redirectUrl = env('MOMO_REDIRECT_URL');
                $ipnUrl = env('MOMO_IPN_URL');
            } elseif (isset($request->ma_giao_dich)) {
                $orderId = $request->ma_giao_dich . '-' . random_int(100000, 999999);
                $redirectUrl = env('MOMO_REDIRECT_VT_URL');
                $ipnUrl = env('MOMO_IPN_VT_URL');
            }
            $extraData = "";

            $requestId = time() . "";
            $requestType = "captureWallet";

            $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType";
            $signature = hash_hmac("sha256", $rawHash, $secretKey);

            $data = [
                'partnerCode' => $partnerCode,
                'partnerName' => "Test",
                "storeId" => "MomoTestStore",
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            ];


            $result = $this->execPostRequest($endpoint, json_encode($data));
            $jsonResult = json_decode($result, true);

            if (isset($jsonResult['payUrl'])) {

                return response()->json(['payUrl' => $jsonResult['payUrl']]);
            } else {
                return response()->json(['message' => 'Không tạo được URL thanh toán'], 500);
            }
        } else {
            return response()->json(['message' => 'Loại thanh toán không hợp lệ'], 400);
        }
    }

    public function savePaymentInfo(Request $request)
    {
        try {
            $trangThai = $request->resultCode ?? null;
            $maOrderMomo = $request->orderId ?? null;
            $maDonHang = explode("-", $maOrderMomo)[0];
            // Lấy dữ liệu từ request
            $data = [
                'partnerCode' => $request->partnerCode,
                'orderId' => $maDonHang,
                'requestId' => $request->requestId,
                'amount' => $request->amount,
                'orderInfo' => $request->orderInfo,
                'orderType' => $request->orderType,
                'transId' => $request->transId ?? null, // kiểm tra tran    sId có thể không tồn tại
                'payType' => $request->payType ?? 'N/A', // kiểm tra payType có thể không tồn tại
                'signature' => $request->signature
            ];
            // Kiểm tra nếu đơn hàng đã tồn tại
            $existingOrder = Momo::where('orderId', $request->orderId)->first();
            if ($existingOrder) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng đã tồn tại.',
                ], 409); // HTTP status code 409: Conflict
            }
            if ($trangThai === 0) {
                // Lưu vào bảng Momo
                Momo::create($data);
                $message = 'Lưu thông tin thanh toán thành công.';
            } else {
                $message = 'Lưu thông tin thanh toán thất bại.';
            }
            return response()->json([
                'status' => true,
                'message' => $message
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi lưu thông tin thanh toán MoMo: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Lỗi lưu thông tin thanh toán.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    //    public function checkDonHang(Request $request)
    //    {
    //        try {
    //            $trangThai = $request->resultCode ?? null;
    //
    //            $maOrderMomo = $request->orderId ?? null;
    //            $maDonHang = explode("-", $maOrderMomo)[0];
    //
    //            // Tìm đơn hàng dựa vào mã đơn hàng
    //            $donHang = DonHang::where('ma_don_hang', $maDonHang)->first();
    //
    //            if (!$donHang) {
    //                return response()->json([
    //                    'status' => false,
    //                    'message' => 'Đơn hàng không tồn tại.'
    //                ], 404);
    //            }
    //
    //            $message = '';
    //
    //            switch ($trangThai) {
    //                case 0:
    //                    // Nếu resultCode là 0, cập nhật trạng thái "Đã thanh toán"
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_DTT]);
    //                    $message = 'Thanh toán thành công.';
    //                    break;
    //
    //                case 4:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Giao dịch bị hủy bởi người dùng.';
    //                    break;
    //
    //                case 5:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Số tiền không hợp lệ.';
    //                    break;
    //
    //                case 6:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Tài khoản MoMo không đủ tiền.';
    //                    break;
    //
    //                case 7:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Giao dịch đã hết hạn.';
    //                    break;
    //
    //                case 8:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Giao dịch không hợp lệ.';
    //                    break;
    //
    //                case 49:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Lỗi chữ ký - Dữ liệu hoặc khóa bí mật không khớp.';
    //                    break;
    //
    //                case 1001:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Địa chỉ IP không được phép.';
    //                    break;
    //
    //                case 1006:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Yêu cầu trùng lặp - Yêu cầu đã được xử lý.';
    //                    break;
    //
    //                case 9000:
    //                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
    //                    $message = 'Lỗi nội bộ - Đã xảy ra lỗi máy chủ không mong muốn.';
    //                    break;
    //
    //                default:
    //                    return response()->json([
    //                        'status' => false,
    //                        'message' => 'Trạng thái không hợp lệ.'
    //                    ], 400);
    //            }
    //
    //            return response()->json([
    //                'status' => true,
    //                'message' => $message
    //            ], 200);
    //        } catch (\Exception $e) {
    //            Log::error("Lỗi lưu thông tin thanh toán MoMo: " . $e->getMessage());
    //            return response()->json([
    //                'status' => false,
    //                'message' => 'Lỗi hệ thống. Vui lòng thử lại sau.'
    //            ], 500);
    //        }
    //    }

    public function checkDonHang(Request $request)
    {
        try {
            $trangThai = $request->resultCode ?? null;
            $maOrderMomo = $request->orderId ?? null;
            $maDonHang = explode("-", $maOrderMomo)[0];

            $donHang = DonHang::where('ma_don_hang', $maDonHang)->first();

            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại.'
                ], 404);
            }

            if (
                $trangThai == 0 && in_array($donHang->phuong_thuc_thanh_toan, [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])
            ) {
                if ($donHang->trang_thai_thanh_toan === DonHang::TTTT_DTT) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Đơn hàng đã được thanh toán trước đó.'
                    ], 200);
                }

                $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_DTT]);
                DB::table('gio_hangs')->where('user_id', $donHang->user_id)->where('chon', 1)->update(['deleted_at' => now()]);

                $thongBao = ThongBao::create([
                    'user_id' => $donHang->user_id,
                    'tieu_de' => 'Đơn hàng đã được thanh toán',
                    'noi_dung' => 'Cảm ơn bạn đã thanh toán mã đơn hàng của bạn là: ' . $donHang->ma_don_hang,
                    'loai' => 'Đơn hàng',
                    'duong_dan' => $donHang->ma_don_hang,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);
                broadcast(new ThongBaoMoi($thongBao))->toOthers();
                event(new SendMail($donHang->email_nguoi_dat_hang, $donHang->ten_nguoi_dat_hang, $donHang));

                return response()->json([
                    'status' => true,
                    'message' => 'Thanh toán thành công.'
                ], 200);
            }

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
                if ($donHang->trang_thai_thanh_toan === DonHang::TTTT_CTT) {
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    DB::table('gio_hangs')->where('user_id', $donHang->user_id)->where('chon', 1)->update(['deleted_at' => now()]);

                    $message = $trangThaiMessages[$trangThai];
                    $thongBao = ThongBao::create([
                        'user_id' => $donHang->user_id,
                        'tieu_de' => 'Đơn hàng chưa được thanh toán',
                        'noi_dung' => $message,
                        'loai' => 'Đơn hàng',
                        'duong_dan' => $donHang->ma_don_hang,
                        'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                    ]);

                    broadcast(new ThongBaoMoi($thongBao))->toOthers();
                }

                return response()->json([
                    'status' => true,
                    'message' => $message
                ], 200);
            }

            return response()->json([
                'status' => false,
                'message' => 'Trạng thái không hợp lệ.'
            ], 400);
        } catch (\Exception $e) {
            Log::error("Lỗi lưu thông tin thanh toán MoMo: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống. Vui lòng thử lại sau.'
            ], 500);
        }
    }
    public function thanhToanLai(Request $request)
    {
        $request->validate([
            'ma_don_hang' => 'required|string',
            'phuong_thuc_thanh_toan' => 'required|string',
            'ma_xac_minh' => 'nullable|string|min:6|max:6',
        ]);
    
        try {
            $user = Auth::user();
            $userId = Auth::id();
            $ma_don_hang = explode("-", $request->ma_don_hang)[0];
            $donHang = DonHang::where('ma_don_hang', $request->ma_don_hang)->first();
    
            // Thanh toán qua MoMo
            if (in_array($request->phuong_thuc_thanh_toan, [DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])) {
                $mangRequest = [
                    'ma_don_hang' => $ma_don_hang,
                    'amount' => $donHang->tong_tien_don_hang,
                    'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                ];
                $donHang->update([
                    'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                ]);
                $url = $this->thanhToanOnlineMomo(new Request($mangRequest));
                return response()->json(['url' => $url->original['payUrl']]);
            }
    
            // Thanh toán trực tiếp
            if ($request->phuong_thuc_thanh_toan == DonHang::PTTT_TT) {
                $donHang->update([
                    'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                ]);
    
                $thongBao = ThongBao::create([
                    'user_id' => $userId,
                    'tieu_de' => 'Đơn hàng đã được đặt',
                    'noi_dung' => 'Cảm ơn bạn đã đặt hàng mã đơn hàng của bạn là: ' . $donHang->ma_don_hang,
                    'loai' => 'Đơn hàng',
                    'duong_dan' => $donHang->ma_don_hang,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);
    
                broadcast(new ThongBaoMoi($thongBao))->toOthers();
                event(new SendMail($request->email_nguoi_dat_hang, $donHang->ten_nguoi_dat_hang, $donHang));
                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Đơn hàng đã được đặt thành công',
                    'data' => $donHang,
                ], 200);
            }
    
            // Thanh toán qua ví tiền
            if ($request->phuong_thuc_thanh_toan == DonHang::PTTT_VT) {
                $viTien = $user->viTien;
    
                // Kiểm tra mã xác minh
                if (!Hash::check($request->ma_xac_minh, $viTien->ma_xac_minh)) {
                    return response()->json([
                        'status' => false,
'message' => 'Mã xác minh không chính xác.',
                    ], 400);
                }
    
                // Kiểm tra số dư
                if ($viTien->so_du < $donHang->tong_tien_don_hang) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Số dư trong ví tiền không đủ để thanh toán.',
                    ], 400);
                }
    
                // Cập nhật đơn hàng và số dư
                $donHang->update([
                    'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                    'trang_thai_thanh_toan' => DonHang::TTTT_DTT,
                ]);
    
                $viTien->update(['so_du' => $viTien->so_du - $donHang->tong_tien_don_hang]);
    
                LichSuGiaoDich::create([
                    'vi_tien_id' => $viTien->id,
                    'so_du_truoc' => $viTien->so_du,
                    'so_du_sau' => $viTien->so_du - $donHang->tong_tien_don_hang,
                    'ngay_thay_doi' => now(),
                    'mo_ta' => "Thanh toán đơn hàng {$donHang->ma_don_hang}",
                ]);
    
                $thongBao = ThongBao::create([
                    'user_id' => $userId,
                    'tieu_de' => 'Đơn hàng đã được đặt',
                    'noi_dung' => 'Cảm ơn bạn đã đặt hàng mã đơn hàng của bạn là: ' . $donHang->ma_don_hang,
                    'loai' => 'Đơn hàng',
                    'duong_dan' => $donHang->ma_don_hang,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);
    
                broadcast(new ThongBaoMoi($thongBao))->toOthers();
                event(new SendMail($request->email_nguoi_dat_hang, $donHang->ten_nguoi_dat_hang, $donHang));
    
                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Đơn hàng đã được đặt thành công',
                    'data' => $donHang,
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi hệ thống',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}