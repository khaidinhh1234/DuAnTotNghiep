<?php

namespace App\Events;

use App\Models\MaKhuyenMai;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
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
     */
    public function __construct(MaKhuyenMai $maKhuyenMai, $hangThanhVienIds)
    {
        $this->maKhuyenMai = $maKhuyenMai;
        $this->hangThanhVienIds = $hangThanhVienIds;
        Log::info('Hạng thành viên ID: ', [$this->hangThanhVienIds]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Sử dụng Channel để công khai
        return [
            new Channel('ma-khuyen-mai'),  // Kênh public
        ];
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
