<?php

namespace App\Listeners;

use App\Events\HoanTatDonHang;
use App\Events\SendMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class GuiMailHoanTatDonHang implements ShouldQueue
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
    public function handle(HoanTatDonHang $event): void
    {
        $donHang = $event->donHang;

        $email = $event->email;
        $name = $donHang->ten_nguoi_dat_hang;

        $chiTietDonHangs = $donHang->chiTietDonHangs;

        Mail::send('emails.donhang', compact('donHang', 'chiTietDonHangs', 'name'), function ($message) use ($email) {
            $message->to($email);
            $message->subject('Xác nhận đơn hàng đã hoàn tất');
        });
    }
}

