<?php

namespace App\Events;

use App\Models\MaKhuyenMai;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MaKhuyenMaiCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $maKhuyenMai;
    public $hangThanhVienIds;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\MaKhuyenMai  $maKhuyenMai
     * @param  array $hangThanhVienIds
     */
    public function __construct(MaKhuyenMai $maKhuyenMai, array $hangThanhVienIds)
    {
        $this->maKhuyenMai = $maKhuyenMai;
        $this->hangThanhVienIds = $hangThanhVienIds;
        Log::info('Hạng thành viên ID: ', [$this->hangThanhVienIds]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\PrivateChannel
     */
    public function broadcastOn()
    {
        // Sử dụng PrivateChannel để chỉ những thành viên đăng nhập mới có thể truy cập
        return new PrivateChannel('ma-khuyen-mai');
    }

    /**
     * Broadcast the event with data.
     *
     * @return array
     */
    public function broadcastWith()
    {
        // Kiểm tra giá trị của hangThanhVienIds
        Log::info('Hang Thanh Vien IDs: ', $this->hangThanhVienIds);

        return [
            'mo_ta' => $this->maKhuyenMai->mo_ta,
            'hang_thanh_vien_ids' => $this->hangThanhVienIds,
        ];
    }
}
