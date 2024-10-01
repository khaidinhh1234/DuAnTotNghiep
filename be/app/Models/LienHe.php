<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LienHe extends Model
{
    use HasFactory;

    protected $fillable = [
        'tai_khoan_lien_he_id',
        'ten_lien_he',
        'sdt_lien_he',
        'email_lien_he',
        'noi_dung_lien_he',
        'loai_lien_he',
        'nguoi_phu_trach_id'

    ];

    public function taiKhoanLienHe()
    {
        return $this->belongsTo(User::class, 'tai_khoan_lien_he_id');
    }

    public function nguoiPhuTrach()
    {
        return $this->belongsTo(User::class, 'nguoi_phu_trach_id');
    }
}
