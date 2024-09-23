<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnhTinTuc extends Model
{
    use HasFactory;
    protected $fillable = [
        'tin_tuc_id',
        'anh_tin_tuc'
    ];
    public function tinTuc(){
        return $this->belongsTo(TinTuc::class, 'tin_tuc_id');
    }
}
