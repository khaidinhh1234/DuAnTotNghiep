<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HoanTien extends Model
{
    use HasFactory;

    protected $fillable = [
        'don_hang_id',
        'giao_dich_vi_id',
        'so_tien_hoan',
        'ly_do',
        'thoi_gian_hoan',
    ];

    public function donHang()
    {
        return $this->belongsTo(DonHang::class);
    }

    public function giaoDichVi()
    {
        return $this->belongsTo(GiaoDichVi::class);
    }

    public function getThoiGianHoanAttribute($value)
    {
        return date('d/m/Y H:i', strtotime($value));
    }
}
