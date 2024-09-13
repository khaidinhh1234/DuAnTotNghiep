<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MaKhuyenMai extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ma_code',
        'mo_ta',
        'giam_gia',
        'loai',
        'so_luong',
        'ngay_bat_dau',
        'ngay_ket_thuc',
        'chi_tieu_toi_thieu',
        'tong_giam_gia_toi_da',
    ];
}
