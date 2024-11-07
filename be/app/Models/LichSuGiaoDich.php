<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LichSuGiaoDich extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vi_tien_id',
        'so_du_truoc',
        'so_du_sau',
        'ngay_thay_doi',
        'mo_ta',
    ];

    public function giaoDichVi()
    {
        return $this->belongsTo(GiaoDichVi::class);
    }

    public function getThoiGianAttribute($value)
    {
        return date('d/m/Y H:i', strtotime($value));
    }
}
