<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BoSuuTap extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'ten',
        'duong_dan',
        'duong_dan_anh',
    ];
    public function sanPhams()
    {
        return $this->belongsToMany(SanPham::class, 'bo_suu_tap_san_pham', 'bo_suu_tap_id','san_pham_id');
    }
}
