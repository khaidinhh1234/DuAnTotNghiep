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
        $schedule->command('promo:update-status')->everyMinute();
        $schedule->command('chuongtrinh:delete-expired')->everyMinute();
        $schedule->command('sanpham:cap-nhat-hang-moi')->everyMinute();
        $schedule->command('khuyenmai:update-gia-tam-thoi')->everyMinute();
        $schedule->command('app:cap-nhat-khach-hang-xac-nhan')->everyMinute();
        $schedule->command('chuongtrinh:guithongbao')->everyMinute();
        $schedule->command('app:cap-nhat-trang-thai-tu-choi-rut-tien')->everyMinute();
        $schedule->command('member:update-rank')->everyMinute();
        $schedule->command('app:xoa-don-chua-thanh-toan')->everyMinute();
        $schedule->command('app:xac-nhan-rut-tien')->everyMinute();
        $schedule->command('app:cap-nhat-huy-hang')->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}