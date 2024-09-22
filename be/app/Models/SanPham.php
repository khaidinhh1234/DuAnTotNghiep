<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SanPham extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'danh_muc_id',
        'ten_san_pham',
        'anh_san_pham',
        'ma_san_pham',
        'duong_dan',
        'mo_ta_ngan',
        'noi_dung',
        'luot_xem',
        'trang_thai'
    ];

    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class);
    }

    public function bienTheSanPham()
    {
        return $this->hasMany(BienTheSanPham::class);
    }
    public function theSanPham()
    {
        return $this->belongsToMany(The::class, 'the_san_pham', 'san_pham_id', 'the_id');
    }

    public function danhGias()
    {
        return $this->hasMany(DanhGia::class, 'san_pham_id');
    }
}
