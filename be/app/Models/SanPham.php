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
        'mo_ta_ngan',
        'noi_dung',
        'luot_xem',
    ];
    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class);
    }

    public function bienTheSanPhams()
    {
        return $this->hasMany(BienTheSanPham::class);
    }
    public function thes()
    {
        return $this->belongsToMany(The::class, 'the_san_pham', 'the_id', 'san_pham_id');
    }
}
