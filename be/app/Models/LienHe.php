<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LienHe extends Model
{
    use HasFactory;

    protected $fillable = [
        'ten_lien_he',
        'sdt_lien_he',
        'email_lien_he',
        'noi_dung_lien_he'
    ];
}
