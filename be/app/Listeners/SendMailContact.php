<?php

namespace App\Listeners;

use App\Events\SendMail;
use App\Models\LienHe;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendMailContact implements ShouldQueue
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
        if ($event->condition === 'contact') {
            $email = $event->email;
            $name = $event->name;
            $noidung = $event->noiDung;
            Mail::send('emails.contact', compact('name', 'noidung', 'email'), function ($message) use ($email) {
                $message->to($email);
                $message->subject('Thông báo liên hệ');
            });
        } elseif ($event->condition === 'blockTaiKhoan') {
            $email = $event->email;
            $name = $event->name;
            $noidung = $event->noiDung;
            Mail::send('emails.blocktaikhoan', compact('name', 'email', 'noidung'), function ($message) use ($email) {
                $message->to($email);
                $message->subject('Thông báo tài khoản bị khóa');
            });
        }
    }
}
