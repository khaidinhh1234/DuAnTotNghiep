<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\Momo;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
            $maDonHang = $request->ma_don_hang;
            $orderInfo = "Thanh toán qua MoMo";
            $amount = $request->amount;
            $orderId = random_int(100000, 999999);
            $redirectUrl = env('MOMO_REDIRECT_URL');
            $ipnUrl = env('MOMO_IPN_URL');
            $extraData = "";

            $requestId = time() . "";
            $requestType = "payWithATM";

            $rawHash = "accessKey=$accessKey&maDonHang=$maDonHang&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType";
            $signature = hash_hmac("sha256", $rawHash, $secretKey);

            $data = [
                'partnerCode' => $partnerCode,
                'partnerName' => "Test",
                "storeId" => "MomoTestStore",
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'maDonHang' => $maDonHang,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $redirectUrl,
                'ipnUrl' => $ipnUrl,
                'lang' => 'vi',
                'extraData' => $extraData,
                'requestType' => $requestType,
                'signature' => $signature
            ];
            // Lưu thông tin thanh toán
            $this->savePaymentInfo($data);
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
            $orderId = random_int(100000, 999999);
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
            // Lưu thông tin thanh toán
            $this->savePaymentInfo($data);
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

    public function savePaymentInfo($data)
    {
        try {
            Momo::create([
                'partnerCode' => $data['partnerCode'],
                'orderId' => $data['orderId'],
                'requestId' => $data['requestId'],
                'amount' => $data['amount'],
                'orderInfo' => $data['orderInfo'],
                'orderType' => $data['requestType'],
                'transId' => $data['transId'] ?? null,
                'payType' => $data['payType'] ?? 'N/A',
                'signature' => $data['signature']
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Đặt hàng thành công.'
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi lưu thông tin thanh toán MoMo: " . $e->getMessage());
        }
    }

    public function checkDonHang(Request $request)
    {
        try {
            $trangThai = $request->resultCode ?? null;
            $maOrderMomo = $request->orderId ?? null;
            $maDonHang = explode("-", $maOrderMomo)[0];
            $donHang = DonHang::where('ma_don_hang',  $maDonHang)->first();

            if (!$donHang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Đơn hàng không tồn tại.'
                ], 404);
            }

            if ($trangThai === 0) {
                $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_DTT]);
                $message = 'Cập nhật thành công.';
            } elseif ($trangThai === 1006) {
                $donHang->update(['trang_thai_thanh_toan' => DonHang::TTTT_CTT]);
                $message = 'Cập nhật thành công.';
            } else {
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
