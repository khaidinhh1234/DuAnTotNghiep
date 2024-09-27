<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DanhGia extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'san_pham_id',
        'so_sao_san_pham',
        'so_sao_dich_vu_van_chuyen',
        'chat_luong_san_pham',
        'mo_ta',
        'huu_ich',
    ];
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'san_pham_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function anhDanhGias()
    {
        return $this->hasMany(AnhDanhGia::class, 'danh_gia_id');
    }
}
