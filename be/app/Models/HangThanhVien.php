<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HangThanhVien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ten_hang_thanh_vien',
        'chi_tieu_toi_thieu',
        'chi_tieu_toi_da',
        'mo_ta',
    ];
    public function users()
    {
        return $this->hasMany(user::class);
    }
}
