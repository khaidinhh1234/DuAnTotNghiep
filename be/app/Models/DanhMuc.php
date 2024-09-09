<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DanhMuc extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'cha_id',
        'ten_danh_muc'
    ];

    public function sanPhams(){
        return $this->hasMany(SanPham::class);
    }
}
