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
        'sdt_lien_he',
        'email',
        'noi_dung_lien_he',
        'loai_lien_he',
    ];

    public function taiKhoanLienHe()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
