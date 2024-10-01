<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BienTheSanPham extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'san_pham_id',
        'bien_the_mau_sac_id',
        'bien_the_kich_thuoc_id',
        'so_luong_bien_the',
    ];

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class);
    }


    public function anhBienThe()
    {
        return $this->hasMany(AnhBienThe::class);
    }

    public function mauBienThe()
    {
        return $this->belongsTo(BienTheMauSac::class);
    }

    public function kichThuocBienThe()
    {
        return $this->belongsTo(BienTheKichThuoc::class);
    }
    public function chiTiets()
    {
        return $this->hasMany(DonHangChiTiet::class, 'bien_the_san_pham_id');
    }
}
