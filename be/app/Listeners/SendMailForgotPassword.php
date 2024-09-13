<?php

namespace App\Listeners;

use App\Events\SendMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendMailForgotPassword implements ShouldQueue
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
        $email = $event->email;
        $token = $event->token;
        Mail::send('emails.password-reset', compact('token'), function ($message) use ($email) {
            $message->to($email);
            $message->subject('Thông báo đặt lại mật khẩu');
        });
    }
}
