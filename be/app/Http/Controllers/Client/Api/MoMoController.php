<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MoMoController extends Controller
{
    public function createMomoPayment(Request $request)
    {
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = env('MOMO_PARTNER_CODE'); // Lấy Partner Code từ .env
        $accessKey = env('MOMO_ACCESS_KEY');     // Lấy Access Key từ .env
        $secretKey = env('MOMO_SECRET_KEY');     // Lấy Secret Key từ .env

        $orderId = time() . ""; // ID đơn hàng, có thể là một chuỗi duy nhất
        $amount = $request->input('amount'); // Số tiền thanh toán
        $orderInfo = "Thanh toán đơn hàng " . $orderId;
        $redirectUrl = env('MOMO_REDIRECT_URL'); // URL callback sau khi thanh toán
        $ipnUrl = env('MOMO_IPN_URL'); // URL IPN
        $requestId = time() . "";
        $extraData = ""; // Thêm dữ liệu tùy chỉnh (nếu có)

        // Tạo chuỗi ký
        $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=captureWallet";
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        // Gửi yêu cầu đến MoMo
        $response = Http::post($endpoint, [
            'partnerCode' => $partnerCode,
            'accessKey' => $accessKey,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'extraData' => $extraData,
            'requestType' => 'captureWallet',
            'signature' => $signature,
        ]);

        // Kiểm tra phản hồi và trả về mã QR nếu thành công
        if ($response->successful()) {
            $data = $response->json();
            return redirect($data['payUrl']); // Chuyển hướng người dùng đến URL thanh toán QR
        }

        return response()->json(['error' => 'Không thể tạo thanh toán MoMo'], 500);
    }

    public function momoCallback(Request $request)
    {
        // Lấy các tham số từ callback
        $partnerCode = $request->input('partnerCode');
        $orderId = $request->input('orderId');
        $requestId = $request->input('requestId');
        $amount = $request->input('amount');
        $orderInfo = $request->input('orderInfo');
        $orderType = $request->input('orderType');
        $transId = $request->input('transId');
        $resultCode = $request->input('resultCode');
        $message = $request->input('message');
        $payType = $request->input('payType');
        $responseTime = $request->input('responseTime');
        $extraData = $request->input('extraData');
        $signature = $request->input('signature');

        // Kiểm tra tính hợp lệ của chữ ký
        $rawHash = "accessKey=" . env('MOMO_ACCESS_KEY') . "&amount=$amount&extraData=$extraData&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&requestId=$requestId&resultCode=$resultCode&transId=$transId";
        $expectedSignature = hash_hmac("sha256", $rawHash, env('MOMO_SECRET_KEY'));

        // So sánh chữ ký
        if ($signature !== $expectedSignature) {
            return response()->json(['message' => 'Chữ ký không hợp lệ'], 401);
        }

        // Kiểm tra nếu thanh toán thành công (resultCode = 0)
        if ($resultCode == 0) {
            // Cập nhật trạng thái đơn hàng hoặc xử lý logic thanh toán thành công
            // Ví dụ: Cập nhật cơ sở dữ liệu ở đây

            return response()->json(['message' => 'Thanh toán thành công'], 200);
        } else {
            return response()->json(['message' => 'Thanh toán thất bại', 'resultCode' => $resultCode, 'message' => $message], 400);
        }
    }
}
