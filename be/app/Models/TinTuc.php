<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TinTuc extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'danh_muc_tin_tuc_id',
        'tieu_de',
        'noi_dung',
        'duong_dan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function danhMucTinTuc()
    {
        return $this->belongsTo(DanhMucTinTuc::class, 'danh_muc_tin_tuc_id');
    }
    public function anhTinTucs()
    {
        return $this->hasMany(AnhTinTuc::class, 'tin_tuc_id');
    }
}
