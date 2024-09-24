<?php

namespace App\Exports;

use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DonHangExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * Lấy tất cả các đơn hàng
     */
    public function collection()
    {
        // Lấy ra tất cả đơn hàng cùng với chi tiết đơn hàng và các mối quan hệ khác
        return DonHang::with('chiTiets.bienTheSanPham.mauBienThe', 'chiTiets.bienTheSanPham.kichThuocBienThe')
            ->get();
    }

    /**
     * Định nghĩa tiêu đề cho các cột Excel
     */
    public function headings(): array
    {
        return [
            'ID Đơn Hàng',
            'Tên Người Đặt Hàng',
            'Số Điện Thoại',
            'Địa Chỉ',
            'Trạng Thái Đơn Hàng',
            'Phương Thức Thanh Toán',
            'Tổng Tiền Đơn Hàng',
            'Mã Giảm Giá',
            'Số Tiền Giảm Giá',
            'Trạng Thái Thanh Toán',
            'Ghi Chú',
            'Chi Tiết Sản Phẩm',
        ];
    }

    /**
     * Định nghĩa dữ liệu từng dòng cho Excel
     */
    public function map($donHang): array
    {
        // Map chi tiết từng đơn hàng
        $chiTietSanPham = $donHang->chiTiets->map(function ($chiTiet) {
            $mauSac = $chiTiet->bienTheSanPham->mauBienThe->ten_mau_sac ?? 'Không có';
            $kichThuoc = $chiTiet->bienTheSanPham->kichThuocBienThe->kich_thuoc ?? 'Không có';

            return "Sản Phẩm: " . $chiTiet->bienTheSanPham->sanPham->ten_san_pham .
                   " - Màu: " . $mauSac .
                   " - Kích Thước: " . $kichThuoc .
                   " - Số Lượng: " . $chiTiet->so_luong .
                   " - Giá: " . number_format($chiTiet->gia, 0, ',', '.') .
                   " - Thành Tiền: " . number_format($chiTiet->thanh_tien, 0, ',', '.');
        })->implode('; ');

        return [
            $donHang->id,
            $donHang->ten_nguoi_dat_hang,
            $donHang->so_dien_thoai_nguoi_dat_hang,
            $donHang->dia_chi_nguoi_dat_hang,
            $donHang->trang_thai_don_hang,
            $donHang->phuong_thuc_thanh_toan,
            number_format($donHang->tong_tien_don_hang, 0, ',', '.'),
            $donHang->ma_giam_gia ?? 'Không có',
            number_format($donHang->so_tien_giam_gia, 0, ',', '.'),
            $donHang->trang_thai_thanh_toan,
            $donHang->ghi_chu ?? 'Không có',
            $chiTietSanPham,
        ];
    }
}
