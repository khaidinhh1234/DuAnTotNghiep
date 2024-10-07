<?php

namespace App\Listeners;

use App\Events\SendMail;
use App\Models\LienHe;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
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
        $token = DB::table('password_reset_tokens')->where('email', $email)->first()->token;
        $name = $event->name;
        if ($event->condition == 'forgot-password') {
            Mail::send('emails.password-reset', compact('token', 'name'), function ($message) use ($email) {
                $message->to($email);
                $message->subject('Thông báo đặt lại mật khẩu');
            });
        }
    }
}
