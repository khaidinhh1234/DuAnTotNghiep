<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LichSuHoatDong extends Model
{
    use HasFactory;

    protected $fillable = [
        'ten_bang',
        'bang_id',
        'loai_thao_tac',
        'du_lieu_cu',
        'du_lieu_moi',
        'nguoi_thao_tac',
    ];

    protected $casts = [
        'du_lieu_cu' => 'array',
        'du_lieu_moi' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'nguoi_thao_tac', 'id');
    }


}
