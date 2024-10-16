<?php

namespace App\Jobs;

use App\Models\VanChuyen;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CapNhatKhachHangXacNhan implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
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
