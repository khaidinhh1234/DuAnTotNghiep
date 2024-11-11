<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hoan_hang extends Model
{
    use HasFactory;

    // Trạng thái hoàn hàng
    const TTHH_CLHH = 'Chờ lấy hàng hoàn';
    const TTHH_DVC = 'Đang vận chuyển';
    const TTHH_THTC = 'Trả hàng thành công';
    protected $fillable = [
        'hoan_tien_id',
        'don_hang_id',
        'user_id',
        'shipper_id',
        'ma_hoan_hang',
        'ngay_tao',
        'trang_thai_hoan_hang',
        'ngay_lay_hang',
        'ngay_hoan_hang_thanh_cong',
    ];

    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'don_hang_id', 'id');
    }

    public function shipper()
    {
        return $this->belongsTo(User::class, 'shipper_id', 'id');
    }

    public function hoanTien()
    {
        return $this->belongsTo(HoanTien::class, 'hoan_tien_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        // Tự động tạo mã đơn hàng khi tạo đơn hàng mới
        static::creating(function ($hoanHang): void {
            $hoanHang->ma_hoan_hang = 'HH' . strtoupper(uniqid());
        });
    }
}
