<?php

namespace App\Listeners;

use App\Events\SendMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendMailBlockTaiKhoan implements ShouldQueue
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
        if ($event->condition === 'blockTaiKhoan') {
            $email = $event->email;
            $name = $event->name;
            $noidung = User::query()->where('email', $email)->first();
            dd($noidung);
            Mail::send('emails.blocktaikhoan', compact('name', 'email', 'noidung'), function ($message) use ($email) {
                $message->to($email);
                $message->subject('Thông báo tài khoản bị khóa');
            });
        }
    }
}
