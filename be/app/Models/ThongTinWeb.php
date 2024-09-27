<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ThongTinWeb extends Model
{
    use HasFactory;

    protected $fillable = [
        'ten_website',
        'logo_website',
        'ten_doanh_nghiep',
        'dia_chi',
        'email',
        'so_dien_thoai_dat_hang',
        'so_dien_thoai_khieu_nai',
        'cau_noi',
        'banner',
        'noi_dung_banner',
        'link_facebook',
        'link_youtube',
        'link_zalo',
        'link_instagram',
        'link_tiktok',
        ];


        protected $casts = [
            'banner' => 'array'
        ];
}
