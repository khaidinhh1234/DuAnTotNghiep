<?php

namespace App\Listeners;

use App\Events\DonHangHoanTat;
use App\Models\DonHang;
use App\Models\HangThanhVien;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CapNhatHangThanhVien
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle($user_id): void
    {
        // Lấy user theo user_id
        $user = User::findOrFail($user_id);
    
        // Tính tổng chi tiêu của user với trạng thái đơn hoàn tất
        $tongChiTieu = $user->donHangs()
            ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
            ->where('trang_thai_thanh_toan', DonHang::TTTT_DTT)
            ->sum('tong_tien_don_hang');
    
        // Xác định hạng thành viên phù hợp
        $hangThanhVien = HangThanhVien::where('chi_tieu_toi_thieu', '<=', $tongChiTieu)
            ->where('chi_tieu_toi_da', '>=', $tongChiTieu)
            ->first();
    
        if ($hangThanhVien) {
            // Cập nhật hạng thành viên
            $user->update(['hang_thanh_vien_id' => $hangThanhVien->id]);
        }
    }
    
}

