<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BienTheMauSac extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'ten_mau_sac',
        'ma_mau_sac',
    ];
    public function bienTheSanPhams()
    {
        return $this->hasMany(BienTheSanPham::class);
    }
}
