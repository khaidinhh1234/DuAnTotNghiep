<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DonHangChiTiet extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'don_hang_id',
        'bien_the_san_pham_id',
        'so_luong',
        'gia',
        'ten_mau_bien_the_san_pham',
        'ten_kich_thuoc_bien_the_san_pham',
        'thanh_tien'
    ];

    // Relationship with DonHang
    public function donHang()
    {
        return $this->belongsTo(DonHang::class);
    }
    public function bienTheSanPham()
    {
        return $this->belongsTo(BienTheSanPham::class, 'bien_the_san_pham_id');
    }
}
