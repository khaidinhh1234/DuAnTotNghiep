<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DonHang extends Model
{
    use HasFactory, SoftDeletes;

    const PTTT_TT = 'Thanh toán khi nhận hàng';
    const PTTT_MM = 'Thanh toán qua Momo';
    const PTTT_NH = 'Thanh toán qua ngân hàng';
    const TTDH_CXH = 'Chờ xác nhận';
    const TTDH_DXH = 'Đã xác nhận';
    const TTDH_DXL = 'Đang xử lý';
    const TTDH_DGH = 'Đang giao hàng';
    const TTDH_DGTC = 'Đã giao hàng thành công';
    const TTDH_DH = 'Đã hủy hàng';
}
