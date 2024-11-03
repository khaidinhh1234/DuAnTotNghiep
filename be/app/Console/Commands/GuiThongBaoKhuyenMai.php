<?php

namespace App\Console\Commands;

use App\Models\ChuongTrinhUuDai;
use App\Models\ThongBao;
use App\Models\User;
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
        $today = $now->toDateString();
        $tomorrow = Carbon::now()->addDay()->toDateString();

        $chuongTrinhUuDai = ChuongTrinhUuDai::where(function ($query) use ($today, $tomorrow) {
            $query->whereDate('ngay_bat_dau', $today)
                ->orWhereDate('ngay_hien_thi', $today)
                ->orWhereDate('ngay_ket_thuc', $tomorrow);
        })->get();

        $this->info("Số chương trình ưu đãi tìm thấy: " . $chuongTrinhUuDai->count());

        foreach ($chuongTrinhUuDai as $chuongTrinh) {
            if ($chuongTrinh->ngay_bat_dau == $today) {
                $this->sendNotification(
                    'Chương trình ưu đãi ' . $chuongTrinh->ten_uu_dai,
                    "Chương trình ưu đãi '{$chuongTrinh->ten_uu_dai}' đang diễn ra hôm nay!",
                    'chuong-trinh',
                    $chuongTrinh->duong_dan
                );
            }

            if ($chuongTrinh->ngay_hien_thi == $today) {
                $this->sendNotification(
                    'Chương trình ưu đãi ' . $chuongTrinh->ten_uu_dai,
                    "Chương trình ưu đãi '{$chuongTrinh->ten_uu_dai}' sẽ bắt đầu vào ngày mai!",
                    'chuong-trinh',
                    $chuongTrinh->duong_dan
                );
            }

            if ($chuongTrinh->ngay_ket_thuc == $tomorrow) {
                $this->sendNotification(
                    'Chương trình ưu đãi sắp kết thúc',
                    "Chương trình ưu đãi '{$chuongTrinh->ten_uu_dai}' sẽ kết thúc vào ngày mai!",
                    'chuong-trinh',
                    $chuongTrinh->duong_dan
                );
            }
        }

        $this->info('Thông báo chương trình ưu đãi đã được gửi.');
    }

    private function sendNotification($title, $content, $link, $duong_dan)
    {
        $users = User::whereHas('vaiTros', function($query) {
            $query->where('vai_tros.ten_vai_tro', 'Khách hàng');
        })->get();

        $this->info("Số người dùng 'Khách hàng' tìm thấy: " . $users->count());

        foreach ($users as $user) {
            $thongBao = ThongBao::create([
                'user_id' => $user->id,
                'tieu_de' => $title,
                'noi_dung' => $content,
                'loai' => 'uu-dai',
                'duong_dan' => $duong_dan,
                'hinh_thu_nho'=> 'https://cuoihoihungthinh.com/wp-content/uploads/2021/09/icon-uu-dai.png'
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();
        }
    }
}
