<?php

namespace App\Providers;

use App\Events\HoanTatDonHang;
use App\Events\PhanHoiLienHe;
use App\Events\SendMail;
use App\Listeners\GuiMailHoanTatDonHang;
use App\Listeners\SendMailContact;
use App\Listeners\SendMailForgotPassword;
use App\Listeners\SendMailPhanHoiLienHe;
use App\Listeners\SendNewProductMailListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        SendMail::class => [
            SendMailForgotPassword::class,
            SendMailContact::class,
            SendMailPhanHoiLienHe::class,
        ],

        HoanTatDonHang::class => [
            GuiMailHoanTatDonHang::class,
        ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
