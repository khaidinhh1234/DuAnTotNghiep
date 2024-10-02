<?php

namespace App\Listeners;

use App\Events\SendMail;
use App\Models\LienHe;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendMailContact
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
        $name = $event->name;
        $noidung = LienHe::query()->where('email', $email)->first()->noi_dung;
        Mail::send('emails.contact', compact('name', 'noidung'), function ($message) use ($email) {
            $message->to($email);
            $message->subject('Thông báo liên hệ');
        });
    }
}
