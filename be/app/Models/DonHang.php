<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class DonHang extends Model
{
    use HasFactory, SoftDeletes;
    // Phương thức thanh toán
    const PTTT_TT = 'Thanh toán khi nhận hàng';
    const PTTT_MM = 'Thanh toán qua Momo';
    const PTTT_NH = 'Thanh toán qua ngân hàng';

    // Trạng thái đơn hàng
    const TTDH_CXH = 'Chờ xác nhận';
    const TTDH_DXH = 'Đã xác nhận';
    const TTDH_DXL = 'Đang xử lý';
    const TTDH_DH = 'Hủy hàng';
    const TTDH_DGH = 'Đang giao hàng';
    const TTDH_DGTC = 'Giao hàng thành công';
    const TTDH_GHTB = 'Giao hàng thất bại';
    const TTDH_HH = 'Hoàn hàng';

    // Trạng thái thanh toán
    const TTTT_CTT = 'Chưa thanh toán';
    const TTTT_DTT = 'Đã thanh toán';

    protected $fillable = [
        'user_id',
        'ghi_chu',
        'trang_thai_don_hang',
        'phuong_thuc_thanh_toan',
        'tong_tien_don_hang',
        'ten_nguoi_dat_hang',
        'so_dien_thoai_nguoi_dat_hang',
        'dia_chi_nguoi_dat_hang',
        'ma_giam_gia',
        'so_tien_giam_gia',
        'ngay_giao_hang_thanh_cong',
        'trang_thai_thanh_toan',
        'trang_thai_van_chuyen'
    ];

    // Relationship with DonHangChiTiet
    public function chiTiets()
    {
        return $this->hasMany(DonHangChiTiet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function danhGias()
    {
        return $this->hasMany(DanhGia::class, 'don_hang_id');
    }

    public function vanChuyen()
    {
        return $this->hasOne(VanChuyen::class);
    }
    public function bienTheSanPhams()
    {
        return $this->hasManyThrough(
            BienTheSanPham::class,       // Bảng đích (biến thể sản phẩm)
            DonHangChiTiet::class,       // Bảng trung gian (chi tiết đơn hàng)
            'don_hang_id',               // Khóa ngoại của DonHangChiTiet tham chiếu tới DonHang
            'id',                        // Khóa chính của BienTheSanPham
            'id',                        // Khóa chính của DonHang
            'bien_the_san_pham_id'       // Khóa ngoại của DonHangChiTiet tham chiếu tới BienTheSanPham
        );
    }

    protected static function boot()
    {
        parent::boot();

        // Tự động tạo mã đơn hàng khi tạo đơn hàng mới
        static::creating(function ($donHang) {
            $donHang->ma_don_hang = 'DH' . strtoupper(uniqid());
        });
    }
}
