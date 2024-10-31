<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LichSuGiaoDich extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'giao_dich_vi_id',
        'so_tien',
        'loai_giao_dich',
        'thoi_gian',
    ];

    public function giaoDichVi()
    {
        return $this->belongsTo(GiaoDichVi::class);
    }

    public function getThoiGianAttribute($value)
    {
        return date('d/m/Y H:i', strtotime($value));
    }
}
