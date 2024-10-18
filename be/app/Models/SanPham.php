<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class SanPham extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;

    protected $fillable = [
        'danh_muc_id',
        'ten_san_pham',
        'anh_san_pham',
        'ma_san_pham',
        'duong_dan',
        'mo_ta_ngan',
        'noi_dung',
        'luot_xem',
        'trang_thai',
        'gia_tot',
        'hang_moi'
    ];

    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class, 'danh_muc_id', 'id');
    }

    public function bienTheSanPham()
    {
        return $this->hasMany(BienTheSanPham::class, 'san_pham_id', 'id');
    }
    public function boSuuTapSanPham()
    {
        return $this->belongsToMany(BoSuuTap::class, 'bo_suu_tap_san_pham', 'san_pham_id', 'bo_suu_tap_id');
    }

    public function danhGias()
    {
        return $this->hasMany(DanhGia::class, 'san_pham_id', 'id');
    }

    public function chuongTrinhUuDais()
    {
        return $this->belongsToMany(ChuongTrinhUuDai::class, 'chuong_trinh_san_pham', 'san_pham_id', 'chuong_trinh_uu_dai_id');
    }

    public function khachHangYeuThich()
    {
        return $this->belongsToMany(User::class, 'san_pham_yeu_thich', 'san_pham_id', 'user_id');
    }

    public function giaThapCaoNhat()
    {
        return $this->bienTheSanPhams()
            ->select(
                'san_pham_id',
                DB::raw('MIN(COALESCE(gia_khuyen_mai_tam_thoi, gia_khuyen_mai, gia_ban)) as gia_thap_nhat'),
                DB::raw('MAX(COALESCE(gia_khuyen_mai_tam_thoi, gia_khuyen_mai, gia_ban)) as gia_cao_nhat')
            )
            ->groupBy('san_pham_id');
    }
}
