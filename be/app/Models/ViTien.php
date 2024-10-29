<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViTien extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'so_du',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function giaoDich()
    {
        return $this->hasMany(GiaoDichVi::class, 'vi_tien_id', 'id');
    }

}
