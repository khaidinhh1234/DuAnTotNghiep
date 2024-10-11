<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VanChuyen extends Model
{
    use HasFactory;

    // Trạng thái vận chuyển
    const TTVC_CXL = 'Chờ xử lý';
    const TTVC_DGH = 'Đang giao hàng';
    const TTVC_GHTC = 'Giao hàng thành công';
    const TTVC_GHTB = 'Giao hàng thất bại';

    // Trạng thái cod
    const TTCOD_CN = 'Chưa nhận';
    const TTCOD_DN = 'Đã nhận';
    const TTCOD_KT = 'Không thu';
    protected $fillable = [
        'don_hang_id',
        'shipper_id',
        'user_id',
        'ma_van_chuyen',
        'ngay_tao',
        'trang_thai_van_chuyen',
        'cod',
        'tien_cod',
        'anh_xac_thuc',
        'shipper_xac_nhan',
        'khach_hang_xac_nhan',
        'ghi_chu',
        'ngay_giao_hang_thanh_cong',
    ];

    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'don_hang_id', 'id');
    }

    public function shipper()
    {
        return $this->belongsTo(User::class, 'shipper_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        // Tự động tạo mã đơn hàng khi tạo đơn hàng mới
        static::creating(function ($vanChuyen): void {
            $vanChuyen->ma_van_chuyen = 'VC' . strtoupper(uniqid());
        });
    }
}
