<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

class NominatimService
{
    protected $baseUrl = 'https://nominatim.openstreetmap.org/search';

    public function geocodeAddress($address)
    {
        try {
            // Gửi yêu cầu tới Nominatim API với User-Agent tùy chỉnh
            $response = Http::withHeaders([
                'User-Agent' => 'chiduc1611@gmail.com/1.0', // Đặt User-Agent của bạn
            ])->get($this->baseUrl, [
                'q' => $address, // Địa chỉ bạn muốn kiểm tra
                'format' => 'json', // Định dạng trả về
                'addressdetails' => 1, // Bao gồm chi tiết địa chỉ
                'limit' => 1, // Giới hạn trả về kết quả
            ]);

            // Kiểm tra mã trạng thái HTTP trả về
            if ($response->successful()) {
                $results = $response->json();

                // Kiểm tra nếu có kết quả trả về
                if (!empty($results)) {
                    return $results[0]; // Trả về kết quả đầu tiên
                } else {
                    return [
                        'success' => false,
                        'message' => 'Không tìm thấy địa chỉ.'
                    ];
                }
            } elseif ($response->clientError()) {
                return [
                    'success' => false,
                    'message' => 'Lỗi phía người dùng. Vui lòng kiểm tra lại địa chỉ.'
                ];
            } elseif ($response->serverError()) {
                return [
                    'success' => false,
                    'message' => 'Lỗi từ dịch vụ geocoding. Vui lòng thử lại sau.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Đã xảy ra lỗi không xác định. Mã lỗi: ' . $response->status()
                ];
            }
        } catch (RequestException $e) {
            return [
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi kết nối: ' . $e->getMessage()
            ];
        }
    }
}
