<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\Momo;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
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
            $orderId = $request->ma_don_hang . '-' . random_int(100000, 999999);
            $redirectUrl = env('MOMO_REDIRECT_URL');
            $ipnUrl = env('MOMO_IPN_URL');
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
            $orderId = $request->ma_don_hang . '-' . random_int(100000, 999999);
            $redirectUrl = env('MOMO_REDIRECT_URL');
            $ipnUrl = env('MOMO_IPN_URL');
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
            return response()->json(['message' => 'Invalid payment type'], 400);
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
                'orderId' => $request->maDonHang,
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


    public function checkDonHang(Request $request)
    {
        try {
            $trangThai = $request->resultCode ?? null;

            $maOrderMomo = $request->orderId ?? null;
            $maDonHang = explode("-", $maOrderMomo)[0];

            // Tìm đơn hàng dựa vào mã đơn hàng
            $donHang = DonHang::where('ma_don_hang', $maDonHang)->first();

            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại.'
                ], 404);
            }

            $message = '';

            switch ($trangThai) {
                case 0:
                    // Nếu resultCode là 0, cập nhật trạng thái "Đã thanh toán"
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_DTT]);
                    $message = 'Thanh toán thành công.';
                    break;

                case 4:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Giao dịch bị hủy bởi người dùng.';
                    break;

                case 5:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Số tiền không hợp lệ.';
                    break;

                case 6:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Tài khoản MoMo không đủ tiền.';
                    break;

                case 7:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Giao dịch đã hết hạn.';
                    break;

                case 8:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Giao dịch không hợp lệ.';
                    break;

                case 49:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Lỗi chữ ký - Dữ liệu hoặc khóa bí mật không khớp.';
                    break;

                case 1001:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Địa chỉ IP không được phép.';
                    break;

                case 1006:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Yêu cầu trùng lặp - Yêu cầu đã được xử lý.';
                    break;

                case 9000:
                    $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                    $message = 'Lỗi nội bộ - Đã xảy ra lỗi máy chủ không mong muốn.';
                    break;

                default:
                    return response()->json([
                        'status' => false,
                        'message' => 'Trạng thái không hợp lệ.'
                    ], 400);
            }

            return response()->json([
                'status' => true,
                'message' => $message
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi lưu thông tin thanh toán MoMo: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống. Vui lòng thử lại sau.'
            ], 500);
        }
    }
}
