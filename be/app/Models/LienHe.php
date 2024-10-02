<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LienHe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'sdt_lien_he',
        'email',
        'noi_dung_lien_he',
        'loai_lien_he',
        // 'nguoi_phu_trach_id'
    ];

    public function taiKhoanLienHe()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // public function nguoiPhuTrach()
    // {
    //     return $this->belongsTo(User::class, 'nguoi_phu_trach_id');
    // }
}
