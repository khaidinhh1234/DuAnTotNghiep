<?php

namespace App\Console\Commands;

use App\Models\DonHang;
use Illuminate\Console\Command;

class XoaDonChuaThanhToan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:xoa-don-chua-thanh-toan';

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
        $donHangs = DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_CTT)
            ->where('phuong_thuc_thanh_toan', '!=', DonHang::PTTT_TT)
            ->where('created_at', '<', now()->subDays(1))
            ->get();

        foreach ($donHangs as $donHang) {
            $donHang->delete();
        }
    }
}
