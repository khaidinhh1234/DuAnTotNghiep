<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LichSuTimKiem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'tim_kiem',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
