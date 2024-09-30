<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MaKhuyenMai;
use Carbon\Carbon;

class UpdateMaKhuyenMaiStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'promo:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cập nhật trạng thái mã khuyến mãi nếu hết hạn hoặc đạt số lượng tối đa.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $now = Carbon::now();

        $maKhuyenMais = MaKhuyenMai::where('trang_thai', 1)->get();

        foreach ($maKhuyenMais as $maKhuyenMai) {
            if ($maKhuyenMai->ngay_ket_thuc < $now || $maKhuyenMai->so_luong_da_su_dung >= $maKhuyenMai->so_luong) {
                $maKhuyenMai->update(['trang_thai' => 0]);

                $this->info('Mã khuyến mãi ' . $maKhuyenMai->ma_code . ' đã được cập nhật trạng thái thành không hoạt động.');
            }
        }

        $this->info('Hoàn thành cập nhật trạng thái mã khuyến mãi.');
        return 0;
    }
}
