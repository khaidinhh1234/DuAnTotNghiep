<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VaiTro extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'ten_vai_tro',
        'mo_ta',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function quyen()
    {
        return $this->belongsToMany(Quyen::class, "quyen_vai_tro", "quyen_id", "vai_tro_id");
    }
}
