<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GiaoDichVi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vi_tien_id',
        'ma_giao_dich',
        'loai_giao_dich',
        'so_tien',
        'mo_ta',
        'trang_thai',
        'thoi_gian_giao_dich',
    ];

    public function viTien()
    {
        return $this->belongsTo(ViTien::class, 'vi_tien_id', 'id');
    }

    public function hoanTien(){
        return $this->hasOne(HoanTien::class, 'giao_dich_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($giaoDich): void {
            $giaoDich->ma_giao_dich = 'GD' . strtoupper(uniqid());
        });
    }
}
