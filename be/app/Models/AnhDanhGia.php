<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnhDanhGia extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'danh_gia_id',
        'anh_danh_gia'
    ];
    public function danhGia(){
        return $this->belongsTo(DanhGia::class, 'danh_gia_id');
    }
}
