<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DanhGia extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'so_sao',
        'noi_dung',
        'huu_ich',
    ];
    public function anhDanhGias()
    {
        return $this->hasMany(AnhDanhGia::class);
    }
}
