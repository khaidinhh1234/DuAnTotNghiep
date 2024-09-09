<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnhDanhGia extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'id_danh_gia',
        'anh_danh_gia'
    ];
    public function danhGia(){
        return $this->belongsTo(DanhGia::class);
    }
}
