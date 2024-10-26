<?php

namespace App\Console\Commands;

use App\Models\MaKhuyenMai;
use App\Models\ThongBao;
use App\Events\ThongBaoMoi;
use Illuminate\Console\Command;
use Carbon\Carbon;

class GuiThongBaoKhuyenMai extends Command
{
    protected $signature = 'khuyenmai:guithongbao';
    protected $description = 'Gửi thông báo khi đến ngày sưu tập hoặc ngày bắt đầu của mã khuyến mãi';

    public function handle()
    {
        $now = Carbon::now();

        $khuyenMaiSuuTam = MaKhuyenMai::whereDate('ngay_bat_dau_suu_tam', $now->toDateString())
            ->where('trang_thai', 1)
            ->get();

        foreach ($khuyenMaiSuuTam as $maKhuyenMai) {
            $thongBao = ThongBao::create([
                'user_id' => 1,
                'tieu_de' => 'Sưu tập mã khuyến mãi',
                'noi_dung' => "Mã khuyến mãi {$maKhuyenMai->ma_code} đã có thể sưu tập!",
                'loai' => 'khuyen_mai',
                'duong_dan' => '/khuyen-mai/' . $maKhuyenMai->id
            ]);
            broadcast(new ThongBaoMoi($thongBao))->toOthers();
        }

        $khuyenMaiBatDau = MaKhuyenMai::whereDate('ngay_bat_dau', $now->toDateString())
            ->where('trang_thai', 1)
            ->get();

        foreach ($khuyenMaiBatDau as $maKhuyenMai) {
            $thongBao = ThongBao::create([
                'user_id' => 1, // Thay 1 bằng ID người nhận nếu có thể
                'tieu_de' => 'Mã khuyến mãi bắt đầu',
                'noi_dung' => "Mã khuyến mãi {$maKhuyenMai->ma_code} đã bắt đầu!",
                'loai' => 'khuyen_mai',
                'duong_dan' => '/khuyen-mai/' . $maKhuyenMai->id
            ]);
            broadcast(new ThongBaoMoi($thongBao))->toOthers();
        }

        $this->info('Thông báo khuyến mãi đã được gửi.');
    }
}
