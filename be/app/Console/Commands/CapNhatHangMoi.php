<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SanPham;
use Carbon\Carbon;

class CapNhatHangMoi extends Command
{
    protected $signature = 'sanpham:cap-nhat-hang-moi';
    protected $description = 'Cập nhật trạng thái hàng mới cho các sản phẩm đã tồn tại hơn 7 ngày';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();

        SanPham::where('hang_moi', true)
            ->where('created_at', '<', $now->subDays(7))
            ->update(['hang_moi' => false]);

        $this->info('Đã cập nhật trạng thái hàng mới cho các sản phẩm sau 7 ngày thành công.');
    }
}
