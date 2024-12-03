<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class YeuCauRutTien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vi_tien_id',
        'so_tien',
        'ngan_hang_id',
        'tai_khoan_ngan_hang',
        'ten_chu_tai_khoan',
        'ngan_hang',
        'logo_ngan_hang',
        'trang_thai',
    ];

    public function viTien()
    {
        return $this->belongsTo(ViTien::class);
    }

    public function nganHang()
    {
        return $this->belongsTo(NganHang::class);
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
