<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BienTheSanPham extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'san_pham_id',
        'bien_the_mau_sac_id',
        'bien_the_kich_thuoc_id',
        'so_luong_bien_the',
        'chi_phi_san_xuat',
        'gia_ban',
        'gia_khuyen_mai',
        'gia_khuyen_mai_tam_thoi',
    ];

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'san_pham_id', 'id');
    }


    public function anhBienThe()
    {
        return $this->hasMany(AnhBienThe::class, 'bien_the_san_pham_id', 'id');
    }

    public function mauBienThe()
    {
        return $this->belongsTo(BienTheMauSac::class, 'bien_the_mau_sac_id', 'id');
    }

    public function kichThuocBienThe()
    {
        return $this->belongsTo(BienTheKichThuoc::class, 'bien_the_kich_thuoc_id', 'id');
    }
    public function chiTiets()
    {
        return $this->hasMany(DonHangChiTiet::class, 'bien_the_san_pham_id', 'id');
    }
    public function DanhGiaBienThe()
    {
        return $this->belongsToMany(DanhGia::class, 'danh_gia_san_phams', 'bien_the_san_pham_id', 'danh_gia_id');
    }
}
