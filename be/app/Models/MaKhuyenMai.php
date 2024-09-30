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
        'ngay_bat_dau_suu_tam',
        'trang_thai'
    ];

    public function sanPhams()
    {
        return $this->belongsToMany(SanPham::class, 'khuyen_mai_san_pham', 'ma_khuyen_mai_id', 'san_pham_id');
    }

    public function hangThanhViens()
    {
        return $this->belongsToMany(HangThanhVien::class, 'ma_khuyen_mai_hang_thanh_vien', 'ma_khuyen_mai_id', 'hang_thanh_vien_id');
    }

    public function danhMucs()
    {
        return $this->belongsToMany(DanhMuc::class, 'khuyen_mai_danh_muc', 'ma_khuyen_mai_id', 'danh_muc_id');
    }
}
