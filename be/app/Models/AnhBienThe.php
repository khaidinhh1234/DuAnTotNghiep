<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnhBienThe extends Model
{
    use HasFactory , SoftDeletes, AuditTrait;
    protected $fillable = [
        'bien_the_san_pham_id',
        'duong_dan_anh',
    ];
    public function bienTheSanPham()
    {
        return $this->belongsTo(BienTheSanPham::class, 'bien_the_san_pham_id', 'id');
    }
}
