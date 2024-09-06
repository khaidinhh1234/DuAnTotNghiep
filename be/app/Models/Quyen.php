<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Stmt\Return_;

class Quyen extends Model
{
    use HasFactory;
    protected $fillable = [
        'ten_quyen',
        'mo_ta',
    ];

    public function vaiTros()
    {
        return $this->belongsToMany(VaiTro::class, "quyen_vai_tro", "vai_tro_id", "quyen_id");
    }
}
