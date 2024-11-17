<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class DanhMuc extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;

    protected $fillable = [
        'cha_id',
        'ten_danh_muc',
        'duong_dan',
        'anh_danh_muc'
    ];

    // Quan hệ với danh mục cha
    public function parent()
    {
        return $this->belongsTo(DanhMuc::class, 'cha_id', 'id');
    }

    // Quan hệ với các danh mục con
    public function children()
    {
        return $this->hasMany(DanhMuc::class, 'cha_id', 'id');
    }

    // Quan hệ với sản phẩm
    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'danh_muc_id', 'id');
    }
}

