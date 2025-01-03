<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class BienTheMauSac extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'ten_mau_sac',
        'ma_mau_sac',
    ];
    public function bienTheSanPhams()
    {
        return $this->hasMany(BienTheSanPham::class, 'bien_the_mau_sac_id', 'id');
    }

    public function sanPhams(): HasManyThrough
    {
        return $this->hasManyThrough(SanPham::class, BienTheSanPham::class, 'bien_the_mau_sac_id', 'id', 'id', 'san_pham_id');
    }
}
