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
        'thanh_tien'
    ];

    // Relationship with DonHang
    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'don_hang_id', 'id');
    }
    public function bienTheSanPham()
    {
        return $this->belongsTo(BienTheSanPham::class, 'bien_the_san_pham_id', 'id');
    }
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'san_pham_id', 'id');
    }

}
