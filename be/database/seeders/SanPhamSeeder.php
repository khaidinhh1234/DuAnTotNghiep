<?php

namespace Database\Seeders;

use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $sanPhams = [
            ['ten_san_pham' => 'Áo thun', 'ma_san_pham' => 'AO001', 'duong_dan' => 'ao-thun', 'mo_ta_ngan' => 'Áo thun chất lượng cao'],
            ['ten_san_pham' => 'Quần jean', 'ma_san_pham' => 'QJ001', 'duong_dan' => 'quan-jean', 'mo_ta_ngan' => 'Quần jean phong cách'],
            ['ten_san_pham' => 'Váy dài', 'ma_san_pham' => 'VD001', 'duong_dan' => 'vay-dai', 'mo_ta_ngan' => 'Váy dài sang trọng'],
        ];

        foreach ($sanPhams as $sanPham) {
            SanPham::create([
                'ten_san_pham' => $sanPham['ten_san_pham'],
                'ma_san_pham' => $sanPham['ma_san_pham'],
                'duong_dan' => $sanPham['duong_dan'],
                'mo_ta_ngan' => $sanPham['mo_ta_ngan'],
                'danh_muc_id' => DanhMuc::inRandomOrder()->first()->id,
            ]);
        }
    }
}
