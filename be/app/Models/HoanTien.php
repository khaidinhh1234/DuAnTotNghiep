<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HoanTien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'don_hang_id',
        'giao_dich_vi_id',
        'so_tien_hoan',
        'ly_do',
        'trang_thai',
        'thoi_gian_hoan',
    ];

    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'don_hang_id');
    }

    public function giaoDichVi()
    {
        return $this->belongsTo(GiaoDichVi::class, 'giao_dich_vi_id');
    }

    public function getThoiGianHoanAttribute($value)
    {
        return date('d/m/Y H:i', strtotime($value));
    }
}
