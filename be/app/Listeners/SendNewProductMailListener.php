<?php

namespace App\Listeners;

use App\Events\SendMail;
use App\Models\LienHe;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendNewProductMailListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SendMail $event): void
    {
        if ($event->condition == 'thong_bao_san_pham_moi') {
            $sanPham = $event->sanPham;
            // Lấy danh sách email của khách hàng quan tâm đến thông tin sản phẩm
            $emails = LienHe::where('loai_lien_he', 'thong_bao_san_pham_moi')->get();

            // Kiểm tra nếu danh sách email không rỗng
            if ($emails) {
                foreach ($emails as $email) {
                    $emailTk = $email->email;
                    $hoTen = $email->ho . ' ' . $email->ten;
                    // Gửi email cho từng địa chỉ
                    Mail::send('emails.send-new-roduct-mail', compact('sanPham', 'emailTk', 'hoTen'), function ($message) use ($email) {
                        $message->to($email->email);
                        $message->subject('Sản phẩm mới đã ra mắt');
                    });
                }
            }
        }
    }
}
