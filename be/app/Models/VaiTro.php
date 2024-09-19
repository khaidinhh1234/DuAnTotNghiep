<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class VaiTro extends Model
{
    use HasFactory;
    protected $fillable = [
        'ten_vai_tro',
        'mo_ta',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, "vai_tro_tai_khoan", "vai_tro_id", "user_id");
    }
    public function quyens()
    {
        return $this->belongsToMany(Quyen::class, "quyen_vai_tro", "vai_tro_id", "quyen_id");
    }
}
