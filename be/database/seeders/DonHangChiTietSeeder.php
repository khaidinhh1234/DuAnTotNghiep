<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\DonHang;
use App\Models\BienTheSanPham;

class DonHangChiTietSeeder extends Seeder
{
    public function run()
    {
        $data = [];
        $now = Carbon::now();
        $donHangs = DonHang::all()->pluck('id')->toArray(); // Lấy danh sách ID của bảng DonHang
        $bienTheSanPhams = BienTheSanPham::all()->pluck('id')->toArray(); // Lấy danh sách ID của bảng BienTheSanPham

        for ($i = 1; $i <= 10; $i++) {
            $so_luong = rand(1, 5);
            $gia = rand(100000, 500000); // Giá ngẫu nhiên từ 100,000 đến 500,000
            $thanh_tien = $so_luong * $gia; // Tính thành tiền dựa trên số lượng và giá

            $data[] = [
                'don_hang_id' => $donHangs[array_rand($donHangs)],
                'bien_the_san_pham_id' => $bienTheSanPhams[array_rand($bienTheSanPhams)],
                'so_luong' => $so_luong,
                'gia' => $gia,
                'thanh_tien' => $thanh_tien,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('don_hang_chi_tiets')->insert($data);
    }
}
