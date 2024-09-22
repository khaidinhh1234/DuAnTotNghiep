<?php

namespace App\Exports;

use App\Models\SanPham;
use Maatwebsite\Excel\Concerns\FromCollection;

class SanPhamExports implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return SanPham::with([
            'danhMuc:id,ten_danh_muc',
            'theSanPham:id,ten_the'
        ])
            ->orderByDesc('id')
            ->get()
            ->map(function ($sanPham) {
                // Thêm tên danh mục vào mỗi sản phẩm
                return [
                    'id' => $sanPham->id,
                    'ten_danh_muc' => $sanPham->danhMuc ? $sanPham->danhMuc->ten_danh_muc : null, // Lấy tên danh mục
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'anh_san_pham' => $sanPham->anh_san_pham,
                    'duong_dan' => $sanPham->duong_dan,
                    'mo_ta_ngan' => $sanPham->mo_ta_ngan,
                    'noi_dung' => $sanPham->noi_dung,
                    'luot_xem' => $sanPham->luot_xem,
                    'trang_thai' => $sanPham->trang_thai == 1 ? 'Action' : 'Inactive',
                ];
            });
    }
}
