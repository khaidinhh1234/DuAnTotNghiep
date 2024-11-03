<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThongBao extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tieu_de',
        'noi_dung',
        'loai',
        'duong_dan',
        'trang_thai_da_doc',
        'hinh_thu_nho'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
