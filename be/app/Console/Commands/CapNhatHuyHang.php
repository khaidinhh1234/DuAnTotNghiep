<?php

namespace App\Console\Commands;

use App\Models\DonHang;
use Illuminate\Console\Command;

class CapNhatHuyHang extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cap-nhat-huy-hang';

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
        // Code xử lý cập nhật hủy hàng
        $HuyHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXNDH)
            ->where('ngay_huy', '<', now()->subDays(7));
        foreach ($HuyHangs as $HuyHang) {
            $HuyHang->update(['trang_thai_don_hang' => DonHang::TTDH_DH]);
        }
    }
}
