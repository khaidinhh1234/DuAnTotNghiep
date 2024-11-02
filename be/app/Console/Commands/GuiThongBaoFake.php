<?php

namespace App\Console\Commands;

use App\Models\ChuongTrinhUuDai;
use App\Models\ThongBao;
use App\Models\User;
use App\Models\VaiTro;
use App\Events\ThongBaoMoi;
use Illuminate\Console\Command;
use Carbon\Carbon;

class GuiThongBaoFake extends Command
{
    protected $signature = 'fake:thongbao';
    protected $description = 'Gửi thông báo khi đến chết';

    public function handle()
    {
        $users = User::get();
        for ($i = 0; $i < 10; $i++) {
            foreach ($users as $user) {
                $thongBao = ThongBao::create([
                    'user_id' => $user->id,
                    'tieu_de' => 'đmmm',
                    'noi_dung' => 'dmm',
                    'loai' => 'uu_dai',
                    'duong_dan' => fake()->url(),
                    'hinh_thu_nho'=> 'https://cuoihoihungthinh.com/wp-content/uploads/2021/09/icon-uu-dai.png'
                ]);

                broadcast(new ThongBaoMoi($thongBao))->toOthers();
            }

        }
        $this->info('Thông báo chương trình ưu đãi đã được gửi.');
    }

}
