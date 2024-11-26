<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GioHang extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'bien_the_san_pham_id',
        'so_luong',
        'chon',
        'het_hang'
        ];


    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'bien_the_san_pham_id', 'id');
    }

    public function bienTheSanPhams()
    {
        return $this->belongsTo(BienTheSanPham::class, 'bien_the_san_pham_id', 'id');
    }
}
