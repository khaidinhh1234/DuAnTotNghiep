<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DonHang;
use App\Models\BienTheSanPham;
use App\Models\DonHangChiTiet;

class DonHangChiTietSeeder extends Seeder
{
    public function run()
    {
        $donHangs = DonHang::all();

        foreach ($donHangs as $donHang) {
            $bienTheSanPham = BienTheSanPham::inRandomOrder()->first();

            if ($bienTheSanPham) {
                $soLuong = rand(1, 10);
                $gia = $bienTheSanPham->gia_ban;
                $thanhTien = $soLuong * $gia;

                // Kiểm tra xem bienTheMauSac có tồn tại không
                $tenMau = $bienTheSanPham->bienTheMauSac ? $bienTheSanPham->bienTheMauSac->ten_mau_sac : 'Không có màu';

                // Kiểm tra xem bienTheKichThuoc có tồn tại không
                $tenKichThuoc = $bienTheSanPham->bienTheKichThuoc ? $bienTheSanPham->bienTheKichThuoc->kich_thuoc : 'Không có kích thước';

                DonHangChiTiet::create([
                    'don_hang_id' => $donHang->id,
                    'bien_the_san_pham_id' => $bienTheSanPham->id,
                    'so_luong' => $soLuong,
                    'gia' => $gia,
                    'ten_mau_bien_the_san_pham' => $tenMau,  // Sử dụng tên màu đã kiểm tra
                    'ten_kich_thuoc_bien_the_san_pham' => $tenKichThuoc,  // Sử dụng tên kích thước đã kiểm tra
                    'thanh_tien' => $thanhTien,
                ]);
            }
        }
    }
}
