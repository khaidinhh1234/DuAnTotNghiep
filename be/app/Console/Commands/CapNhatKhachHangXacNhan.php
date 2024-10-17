<?php

namespace App\Console\Commands;

use App\Models\VanChuyen;
use Illuminate\Console\Command;

class CapNhatKhachHangXacNhan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cap-nhat-khach-hang-xac-nhan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orders = VanChuyen::whereNotNull('ngay_giao_hang_thanh_cong')
            ->where('khach_hang_xac_nhan', "!=", 1)
            ->where('ngay_giao_hang_thanh_cong',  "<", now()->subDays(3))
            ->get();

        foreach ($orders as $order) {
            $order->update([
                'khach_hang_xac_nhan' => 1
            ]);
        }
    }
}
