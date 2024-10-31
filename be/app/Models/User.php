<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    const TYPE_NAM = 1;
    const TYPE_NU = 2;
    const TYPE_KHAC = 3;
    protected $fillable = [
        'ho',
        'ten',
        'anh_nguoi_dung',
        'email',
        'password',
        'so_dien_thoai',
        'dia_chi',
        'ngay_sinh',
        'gioi_tinh',
        'hang_thanh_vien_id',
        'an_danh'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function vaiTros()
    {
        return $this->belongsToMany(VaiTro::class, 'vai_tro_tai_khoan', 'user_id', 'vai_tro_id');
    }

    public function lichSuTimKiem()
    {
        return $this->hasMany(LichSuTimKiem::class, 'user_id', 'id');
    }

    public function tinTuc()
    {
        return $this->hasMany(TinTuc::class, 'user_id', 'id');
    }

    public function hangThanhVien()
    {
        return $this->belongsTo(HangThanhVien::class, 'hang_thanh_vien_id', 'id');
    }

    public function danhGias()
    {
        return $this->hasMany(DanhGia::class, 'user_id', 'id');
    }

    public function donHangs()
    {
        return $this->hasMany(DonHang::class, 'user_id', 'id');
    }

    public function vanChuyens()
    {
        return $this->hasMany(VanChuyen::class, 'user_id', 'id');
    }

    public function lienHe()
    {
        return $this->hasMany(LienHe::class, 'tai_khoan_lien_he_id', 'id');
    }
    public function lienHesPhuTrach()
    {
        return $this->hasMany(LienHe::class, 'nguoi_phu_trach_id', 'id');
    }

    public function sanPhamYeuThich()
    {
        return $this->belongsToMany(SanPham::class, 'san_pham_yeu_thich', 'user_id', 'san_pham_id');
    }
    public function danhGiaHuuIch()
    {
        return $this->belongsToMany(DanhGia::class, 'danh_gia_huu_ich', 'user_id', 'danh_gia_id');
    }

    public function viTien(){
        return $this->hasOne(ViTien::class, 'user_id', 'id');
    }
    public function nganHang(){
        return $this->hasMany(NganHang::class, 'user_id', 'id');
    }
}
