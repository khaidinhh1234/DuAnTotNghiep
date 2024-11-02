<?php

namespace App\Listeners;

use App\Events\SendMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class GuiMailHoanTatDonHang implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(SendMail $event): void
    {
        $donHang = $event->condition;
        $email = $event->email;
        $name = $event->name;

//        $chiTietDonHangs = $donHang->chiTiets;

        try {
            Mail::send('emails.donhang', compact('donHang', 'name'), function ($message) use ($email) {
                $message->to($email)
                    ->subject('Xác nhận đơn hàng đã hoàn tất');
            });
        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }
    }
}
