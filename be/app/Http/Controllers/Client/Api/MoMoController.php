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
        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');

        $orderId = time() . ""; // ID đơn hàng duy nhất
        $amount = $request->input('amount');
        $orderInfo = "Thanh toán đơn hàng " . $orderId;
        $redirectUrl = env('MOMO_REDIRECT_URL');
        $ipnUrl = env('MOMO_IPN_URL');
        $requestId = time() . "";
        $extraData = "";

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

        if ($response->successful()) {
            $data = $response->json();
            return redirect($data['payUrl']); // Chuyển hướng người dùng đến URL thanh toán QR
        }

        return response()->json(['error' => 'Không thể tạo thanh toán MoMo'], 500);
    }

    public function momoCallback(Request $request)
    {
        // Lấy các tham số từ callback của MoMo
        $partnerCode = $request->input('partnerCode');
        $orderId = $request->input('orderId');
        $requestId = $request->input('requestId');
        $amount = $request->input('amount');
        $orderInfo = $request->input('orderInfo');
        $resultCode = $request->input('resultCode');
        $transId = $request->input('transId');
        $extraData = $request->input('extraData');
        $signature = $request->input('signature');

        // Tạo chuỗi ký `rawHash` để xác nhận chữ ký
        $rawHash = "accessKey=" . env('MOMO_ACCESS_KEY') .
                   "&amount=" . $amount .
                   "&extraData=" . $extraData .
                   "&orderId=" . $orderId .
                   "&orderInfo=" . $orderInfo .
                   "&partnerCode=" . $partnerCode .
                   "&requestId=" . $requestId .
                   "&resultCode=" . $resultCode .
                   "&transId=" . $transId;

        // Tạo chữ ký từ `rawHash`
        $expectedSignature = hash_hmac("sha256", $rawHash, env('MOMO_SECRET_KEY'));

        // Kiểm tra chữ ký và các bước xử lý
        if ($signature !== $expectedSignature) {
            // Debug chữ ký và chuỗi ký để kiểm tra giá trị
            // dd($rawHash, $expectedSignature, $signature);
            return response()->json(['message' => 'Chữ ký không hợp lệ'], 401);
        }

        if ($resultCode == 0) {
            // Xử lý logic khi thanh toán thành công
            return response()->json(['message' => 'Thanh toán thành công'], 200);
        } else {
            // Xử lý khi thanh toán thất bại
            return response()->json([
                'message' => 'Thanh toán thất bại',
                'resultCode' => $resultCode,
                // 'error' => $message,
            ], 400);
        }
    }


}
