<?php

namespace App\Listeners;

use App\Events\DonHangHoanTat;
use App\Http\Controllers\Admin\Api\ThongBaoTelegramController;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class GuiThongBaoDonHangHoanTat
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
    public function handle(DonHangHoanTat $event)
    {
        $donHang = $event->donHang;
        $thongBaoController = new ThongBaoTelegramController();
        $thongBaoController->thongBaoHoanTatDonHang($donHang);
    }
}
