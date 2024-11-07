<?php

namespace App\Models;

use App\Events\DonHangHoanTat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\HoanTien;


class DonHang extends Model
{
    use HasFactory, SoftDeletes;
    // Phương thức thanh toán
    const PTTT_TT = 'Thanh toán khi nhận hàng';
    const PTTT_MM_ATM = 'Momo_ATM';
    const PTTT_MM_QR = 'Momo_QR';
    const PTTT_VT = 'Ví tiền';

    // Trạng thái đơn hàng
    const TTDH_CXH = 'Chờ xác nhận';
    const TTDH_DXH = 'Đã xác nhận';
    const TTDH_DXL = 'Đang xử lý';
    const TTDH_DH = 'Hủy hàng';
    const TTDH_DGH = 'Đang giao hàng';
    const TTDH_CKHCN = 'Chờ khách hàng xác nhận';
    const TTDH_HTDH = 'Hoàn tất đơn hàng';
    const TTDH_DHTB = 'Đơn hàng bị từ chối nhân';
    const TTDH_HH = 'Hoàn hàng';
    const TTDH_CXNHH = 'Chờ xác nhận hoàn hàng';
    const TTDH_TCHH = 'Từ chối hoàn hàng';


    // Lí do hủy hàng
    const HH_TDTT = 'Thay đổi thông tin';
    const HH_TDSP = 'Thay đổi sản phẩm';
    const HH_TTRR = 'Thanh toán rắc rối';
    const HH_TDNMH = 'Thay đổi nơi mua hàng';


    // lí do hoàn hàng
    const HH_SPL = 'Sản phẩm lỗi';
    const HH_SPSMT = 'Sản phẩm sai mô tả';
    const HH_SPQH = 'Sản phẩm quá hạn';
    // Trạng thái thanh toán
    const TTTT_CTT = 'Chưa thanh toán';
    const TTTT_DTT = 'Đã thanh toán';
    const TTTT_DHT = "Đã hoàn tiền";

    protected $fillable = [
        'user_id',
        'ghi_chu',
        'trang_thai_don_hang',
        'phuong_thuc_thanh_toan',
        'tong_tien_don_hang',
        'ten_nguoi_dat_hang',
        'so_dien_thoai_nguoi_dat_hang',
        'email_nguoi_dat_hang',
        'dia_chi_nguoi_dat_hang',
        'ma_giam_gia',
        'so_tien_giam_gia',
        'ngay_hoan_thanh_don',
        'trang_thai_thanh_toan',
        'trang_thai_van_chuyen',
        'li_do_hoan_hang',
        'hinh_anh_hoan_tra',
        'li_do_huy_hang',
        'mien_phi_van_chuyen'
    ];

    // Relationship with DonHangChiTiet
    public function chiTiets()
    {
        return $this->hasMany(DonHangChiTiet::class, 'don_hang_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function danhGias()
    {
        return $this->hasMany(DanhGia::class, 'don_hang_id', 'id');
    }

    public function vanChuyen()
    {
        return $this->hasOne(VanChuyen::class, 'don_hang_id', 'id');
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

    public function hoanTien()
    {
        return $this->hasOne(HoanTien::class, 'don_hang_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        // Tự động tạo mã đơn hàng khi tạo đơn hàng mới
        static::creating(function ($donHang) {
            $donHang->ma_don_hang = 'DH' . strtoupper(uniqid());
        }); 

        static::updated(function ($donHang) {
            if ($donHang->trang_thai_don_hang === DonHang::TTDH_HTDH && $donHang->trang_thai_thanh_toan === DonHang::TTTT_DTT) {
                event(new DonHangHoanTat($donHang));
            }
        });
    }


    public static function getPhuongThucThanhToan($phuongThucThanhToan)
    {
        $phuongThucThanhToanNames = [
            self::PTTT_TT => 'Thanh toán khi nhận hàng',
            self::PTTT_MM_ATM => 'Thanh toán qua Momo ATM',
            self::PTTT_MM_QR => 'Thanh toán qua MoMo QR',
            self::PTTT_VT => 'Thanh toán qua ví tiền',
        ];

        return $phuongThucThanhToanNames[$phuongThucThanhToan] ?? 'Phương thức thanh toán không xác định';
    }

    public static function getTrangThaiThanhToan($trangThaiThanhToan)
    {
        $trangThaiThanhToanNames = [
            self::TTTT_CTT => 'Chưa thanh toán',
            self::TTTT_DTT => 'Đã thanh toán',
        ];

        return $trangThaiThanhToanNames[$trangThaiThanhToan] ?? 'Trạng thái thanh toán không xác định';
    }

    public static function getTrangThaiDonHang($trangThaiDonHang)
    {
        $trangThaiDonHangNames = [
            self::TTDH_CXH => 'Chờ xác nhận',
            self::TTDH_DXH => 'Đã xác nhận',
            self::TTDH_DXL => 'Đang xử lý',
            self::TTDH_DH => 'Hủy hàng',
            self::TTDH_DGH => 'Đang giao hàng',
            self::TTDH_CKHCN => 'Chờ khách hàng xác nhận',
            self::TTDH_HTDH => 'Hoàn tất đơn hàng',
            self::TTDH_DHTB => 'Đơn hàng bị từ chối nhận',
            self::TTDH_HH => 'Hoàn hàng',
        ];

        return $trangThaiDonHangNames[$trangThaiDonHang] ?? 'Trạng thái đơn hàng không xác định';
    }
}
