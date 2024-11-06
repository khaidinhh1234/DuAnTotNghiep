<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VanChuyen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Telegram\Bot\Laravel\Facades\Telegram;


class ThongBaoTelegramController extends Controller
{
    // Hàm gửi thông báo qua Telegram khi có đơn hàng mới cho tất cả shipper
    public function thongBaoDonHangMoi(Request $request)
    {
        $vanChuyenId = $request->id_van_chuyen;
        // Tìm thông tin vận chuyển và shipper
        $vanChuyen = VanChuyen::find($vanChuyenId);

        // Kiểm tra xem đơn hàng có tồn tại
        if (!$vanChuyen) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }

        // Chuẩn bị nội dung thông báo
        $message = "📦 Đơn hàng mới đã được giao cho bạn!\n";
        $message .= "Mã vận chuyển: {$vanChuyen->ma_van_chuyen}\n";
        $message .= "Trạng thái: {$vanChuyen->trang_thai_van_chuyen}\n";
        $message .= "COD: {$vanChuyen->tien_cod} VND\n";
        $message .= "Ghi chú: {$vanChuyen->ghi_chu}\n";

        // Lấy danh sách các shipper có số điện thoại và `chat_id`
        $shippers = User::whereNotNull('so_dien_thoai')
            ->whereNotNull('telegram_chat_id')
            ->get();

        // Gửi thông báo tới từng shipper
        foreach ($shippers as $shipper) {
            $this->sendTelegramMessage($shipper->telegram_chat_id, $message);
        }

        return response()->json(['message' => 'Thông báo đã được gửi tới tất cả shipper.']);
    }
    public function thongBaoHoanTatGiaoHang($id)
    {
        $vanChuyen = VanChuyen::find($id);

        $donHang = $vanChuyen->donHang;
        if (!$vanChuyen) {
            return response()->json([
                'message' => 'Không tìm thấy đơn vận chuyển.'
            ], 404);
        }

        if ($vanChuyen->trang_thai_van_chuyen != VanChuyen::TTVC_GHTC) {
            return response()->json([
                'message' => 'Đơn hàng chưa giao thành công.'
            ], 400);
        }

        $message = "✅ Đơn hàng {$donHang->ma_don_hang} đã hoàn tất thành công!\n";
        $message .= "Khách hàng: {$donHang->ten_nguoi_dat_hang}\n";
        $message .= "Tổng tiền: {$donHang->tong_tien_don_hang} VND\n";

        $shipper = User::findOrFail($vanChuyen->shipper_id);

        $this->sendTelegramMessage($shipper->telegram_chat_id, $message);

        return response()->json(['message' => 'Thông báo hoàn tất đơn hàng đã được gửi.']);
    }

    // Hàm gửi tin nhắn qua Telegram
    private function sendTelegramMessage($chatId, $message)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $url = "https://api.telegram.org/bot{$token}/sendMessage";

        $response = Http::post($url, [
            'chat_id' => $chatId,
            'text' => $message,
        ]);

        if ($response->successful()) {
            return $response->json();
        } else {
            // Xử lý lỗi khi gửi thất bại
            Log::error("Gửi thông báo Telegram thất bại: " . $response->body());
            return ['error' => 'Không thể gửi tin nhắn qua Telegram'];
        }
    }
}
