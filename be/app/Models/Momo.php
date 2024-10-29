<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Momo extends Model
{
    use HasFactory;

    protected $table = 'momo';

    protected $fillable = [
        'partnerCode',
        'orderId',
        'requestId',
        'amount',
        'orderInfo',
        'orderType',
        'transId',
        'payType',
        'signature',
    ];

    /**
     * Define any relationships or custom logic for the Momo model here
     */
}
