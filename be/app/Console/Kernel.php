<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('promo:update-status')->hourly();
        $schedule->command('chuongtrinh:delete-expired')->daily();
        $schedule->command('sanpham:cap-nhat-hang-moi')->daily();
        $schedule->command('khuyenmai:update-gia-tam-thoi')->hourly();
    }


    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
