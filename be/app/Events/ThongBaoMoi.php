<?php

namespace App\Events;

use App\Models\ThongBao;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ThongBaoMoi implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $thongBao;

    public function __construct(ThongBao $thongBao)
    {
        $this->thongBao = $thongBao;
        Log::info('Thông báo mới được khởi tạo:', $this->broadcastWith());
    }

//    public function broadcastOn()
//    {
//        Log::info('Đang phát thông báo trên kênh:', ['channel' => 'users.' . $this->thongBao->user_id]);
//        return new PrivateChannel('users.' . $this->thongBao->user_id);
//    }

    public function broadcastOn()
    {
        return new Channel('thong-bao');
    }

    public function broadcastWith()
    {
        $data = [
            'id' => $this->thongBao->id,
            'tieu_de' => $this->thongBao->tieu_de,
            'noi_dung' => $this->thongBao->noi_dung,
            'loai' => $this->thongBao->loai,
            'duong_dan' => $this->thongBao->duong_dan,
            'loai_duong_dan' => $this->thongBao->loai_duong_dan,
            'id_duong_dan' => $this->thongBao->id_duong_dan,
        ];

        Log::info('Thông báo được phát:', $data);
        return $data;
    }
}
