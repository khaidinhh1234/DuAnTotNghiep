<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BienTheKichThuoc extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'kich_thuoc',
        'loai_kich_thuoc'
    ];
    public function bienTheSanPhams()
    {
        return $this->hasMany(BienTheSanPham::class, 'bien_the_kich_thuoc_id', 'id');
    }

    public function sanPhams()
    {
        return $this->hasManyThrough(SanPham::class, BienTheSanPham::class, 'bien_the_kich_thuoc_id', 'id', 'id', 'san_pham_id');
    }
}
