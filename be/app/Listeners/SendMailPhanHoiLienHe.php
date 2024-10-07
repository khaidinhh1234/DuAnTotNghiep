<?php

namespace App\Listeners;

use App\Events\PhanHoiLienHe;
use App\Models\LienHe;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMailPhanHoiLienHe
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
    public function handle(PhanHoiLienHe $event): void
    {
        $email = $event->email;
        $name = $event->name;
        $lien_he = LienHe::query()->where('email', $email)->first();
        if ($lien_he) {
            $noi_dung_phan_hoi = $lien_he->noi_dung_phan_hoi;
            Mail::send('emails.phan-hoi', compact('noi_dung_phan_hoi', 'name', 'email'), function ($message) use ($email) {
                $message->to($email);
                $message->subject('Phản hồi từ Admin');
            });
        } else {
            Log::warning("Không tìm thấy thông tin liên hệ cho email: $email");
        }
    }
}
