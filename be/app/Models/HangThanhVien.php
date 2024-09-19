<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HangThanhVien extends Model
{
    use HasFactory;

    protected $fillable = [
        'ten_hang_thanh_vien',
        'chi_tieu_toi_thieu',
        'mo_ta',
    ];
}
