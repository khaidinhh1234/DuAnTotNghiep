<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LienHe extends Model
{
    use HasFactory, AuditTrait;

    protected $fillable = [
        'user_id',
        'name',
        'noi_dung_lien_he',
        'sdt_lien_he',
        'loai_lien_he',
        'trang_thai_lien_he',
        'noi_dung_phan_hoi',
    ];

    public function taiKhoanLienHe()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
