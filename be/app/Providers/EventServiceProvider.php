<?php

namespace App\Providers;

use App\Events\DonHangHoanTat;
use App\Events\HoanTatDonHang;
use App\Events\PhanHoiLienHe;
use App\Events\SendMail;
use App\Listeners\CapNhatHangThanhVien;
use App\Listeners\GuiMailHoanTatDonHang;
use App\Listeners\GuiThongBaoDonHangHoanTat;
use App\Listeners\SendMailContact;
use App\Listeners\SendMailForgotMaXacMinh;
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
            SendMailForgotMaXacMinh::class,
            GuiMailHoanTatDonHang::class,

        ],
        DonHangHoanTat::class => [
            GuiThongBaoDonHangHoanTat::class,
            CapNhatHangThanhVien::class,
        ],
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
