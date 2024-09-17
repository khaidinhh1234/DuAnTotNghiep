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
    const TYPE_KHAC = 0;
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
        return $this->hasMany(LichSuTimKiem::class);
    }

    public function tinTuc() {
        return $this->hasMany(TinTuc::class, 'user_id');
    }
}
