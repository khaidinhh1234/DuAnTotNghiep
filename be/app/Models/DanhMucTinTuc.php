<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DanhMucTinTuc extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;

    protected $fillable = [
        'ten_danh_muc_tin_tuc',
        'duong_dan',
    ];
    public function tinTuc() {
        return $this->hasMany(TinTuc::class, 'danh_muc_tin_tuc_id', 'id');
    }
}
