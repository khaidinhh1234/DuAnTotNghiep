<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NganHang extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tai_khoan_ngan_hang',
        'ten_chu_tai_khoan',
        'ngan_hang',
        'logo_ngan_hang',
    ];

    public function yeuCauRutTien()
    {
        return $this->hasMany(YeuCauRutTien::class, 'ngan_hang_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
