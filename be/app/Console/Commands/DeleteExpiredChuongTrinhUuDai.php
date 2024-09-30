<?php

namespace App\Console\Commands;

use App\Models\ChuongTrinhUuDai;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteExpiredChuongTrinhUuDai extends Command
{
    protected $signature = 'chuongtrinh:delete-expired';
    protected $description = 'Xóa chương trình ưu đãi đã hết hạn';

    public function handle()
    {
        $expiredUuDais = ChuongTrinhUuDai::where('ngay_ket_thuc', '<', Carbon::now())->get();

        foreach ($expiredUuDais as $uuDai) {
            $uuDai->delete(); // Xóa chương trình ưu đãi
        }

        $this->info('Đã xóa tất cả chương trình ưu đãi đã hết hạn.');
    }
}
