<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TinTuc extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'user_id',
        'danh_muc_tin_tuc_id',
        'tieu_de',
        'anh_tin_tuc',
        'noi_dung',
        'duong_dan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function danhMucTinTuc()
    {
        return $this->belongsTo(DanhMucTinTuc::class, 'danh_muc_tin_tuc_id');
    }
}
