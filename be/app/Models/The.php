<?php

namespace App\Models;

use App\Traits\AuditTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class The extends Model
{
    use HasFactory, SoftDeletes, AuditTrait;
    protected $fillable = [
        'ten_the',
        'duong_dan',
    ];
    public function sanPhams()
    {
        return $this->belongsToMany(SanPham::class, 'the_san_pham', 'san_pham_id', 'the_id');
    }
}
