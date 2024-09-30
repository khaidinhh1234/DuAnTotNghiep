<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChuongTrinhUuDai extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'ten_uu_dai',
        'duong_dan',
        'duong_dan_anh',
        'mo_ta',
        'ngay_hien_thi',
        'ngay_bat_dau',
        'ngay_ket_thuc',
        'gia_tri_uu_dai',
        'loai'
    ];

    public function sanPhams()
    {
        return $this->belongsToMany(SanPham::class, 'chuong_trinh_san_pham', 'chuong_trinh_uu_dai_id', 'san_pham_id');
    }
}
