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
        'gia_ban',
        'gia_khuyen_mai',
        'so_luong_bien_the'
    ];
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class);
    }
    public function bienTheMauSac()
    {
        return $this->belongsTo(BienTheMauSac::class);
    }
    public function bienTheKichThuoc()
    {
        return $this->belongsTo(BienTheKichThuoc::class);
    }
    public function anhBienThes()
    {
        return $this->hasMany(AnhBienThe::class);
    }
}
