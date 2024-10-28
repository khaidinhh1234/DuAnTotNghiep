<?php

namespace App\Console\Commands;

use App\Models\ChuongTrinhUuDai;
use App\Models\ThongBao;
use App\Models\User;
use App\Models\VaiTro; // Đảm bảo import mô hình VaiTro
use App\Events\ThongBaoMoi;
use Illuminate\Console\Command;
use Carbon\Carbon;

class GuiThongBaoKhuyenMai extends Command
{
    protected $signature = 'chuongtrinh:guithongbao';
    protected $description = 'Gửi thông báo khi đến ngày bắt đầu hoặc ngày hiện của chương trình ưu đãi';

    public function handle()
    {
        $now = Carbon::now();

        $chuongTrinhUuDai = ChuongTrinhUuDai::where(function ($query) use ($now) {
            $query->whereDate('ngay_bat_dau', $now->toDateString())
                ->orWhereDate('ngay_hien_thi', $now->toDateString());
        })
            ->get();

        foreach ($chuongTrinhUuDai as $chuongTrinh) {
            $this->sendNotification(
                'Chương trình ưu đãi mới',
                "Chương trình ưu đãi '{$chuongTrinh->ten_uu_dai}' đã bắt đầu hoặc đến hạn vào ngày hôm nay!",
                '/chuong-trinh/' . $chuongTrinh->duong_dan
            );
        }

        $this->info('Thông báo chương trình ưu đãi đã được gửi.');
    }

    /**
     */
    private function sendNotification($title, $content, $link)
    {
        $users = User::whereHas('vaiTros', function($query) {
            $query->where('vai_tros.ten_vai_tro', 'Khách hàng');
        })->get();

        foreach ($users as $user) {
            $thongBao = ThongBao::create([
                'user_id' => $user->id,
                'tieu_de' => $title,
                'noi_dung' => $content,
                'loai' => 'uu_dai',
                'duong_dan' => $link,
                'hinh_thu_nho'=> 'https://cuoihoihungthinh.com/wp-content/uploads/2021/09/icon-uu-dai.png'
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();
        }
    }
}
