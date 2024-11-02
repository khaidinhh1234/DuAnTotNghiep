<?php

namespace App\Listeners;

use App\Events\SendMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class SendMailForgotMaXacMinh implements ShouldQueue
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
        if ($event->condition === 'forgotMaXacMinh') {
            $email = $event->email;
            $name = $event->name;
            $user = User::query()->where('email', $email)->first();
            $maXacMinhMoi = rand(100000, 999999);
            $maXacMinh = str_split($maXacMinhMoi);
            $user->viTien->update(['ma_xac_minh' => Hash::make($maXacMinhMoi)]);
            Mail::send('emails.maxacminh', compact('name', 'email', 'maXacMinh'), function ($message) use ($email) {
                $message->to($email);
                $message->subject('Thông báo mã xác minh');
            });
        }
    }
}
