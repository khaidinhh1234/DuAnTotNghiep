<?php

namespace Database\Seeders;

use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $danhMucs = DanhMuc::all();

        for ($i = 1; $i <= 10; $i++) {
            SanPham::create([
                'ten_san_pham' => 'Sản Phẩm ' . $i,
                'anh_san_pham' => 'path_to_image_' . $i . '.jpg',
                'ma_san_pham' => 'SP' . $i,
                'duong_dan' => 'san-pham-' . $i,
                'gia_ban' => rand(10000, 50000),
                'gia_khuyen_mai' => rand(5000, 30000),
                'ngay_bat_dau_khuyen_mai' => now(),
                'ngay_ket_thuc_khuyen_mai' => now()->addDays(10),
                'mo_ta_ngan' => 'Mô tả ngắn cho sản phẩm ' . $i,
                'noi_dung' => 'Nội dung cho sản phẩm ' . $i,
                'danh_muc_id' => $danhMucs->random()->id,
            ]);
        }
    }
}
