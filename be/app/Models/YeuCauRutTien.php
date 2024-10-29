<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YeuCauRutTien extends Model
{
    use HasFactory;

    protected $fillable = [
        'vi_tien_id',
        'so_tien',
        'taikhoan_ngan_hang',
        'ten_chu_tai_khoan',
        'ngan_hang',
        'phuong_thuc',
        'trang_thai',
    ];

    public function viTien()
    {
        return $this->belongsTo(ViTien::class);
    }
    public function getTrangThaiAttribute($value)
    {
        return match ($value) {
            'cho_duyet' => 'Chờ duyệt',
            'da_duyet' => 'Đã duyệt',
            'da_rut' => 'Đã rút',
            'that_bai' => 'Thất bại',
            default => 'Không xác định',
        };
    }
}
