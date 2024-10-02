<?php

namespace Database\Seeders;

use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\BienTheSanPham;
use App\Models\SanPham;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BienTheSanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            BienTheSanPham::create([
                'san_pham_id' => SanPham::inRandomOrder()->first()->id, // Chọn sản phẩm ngẫu nhiên
                'bien_the_mau_sac_id' => BienTheMauSac::inRandomOrder()->first()->id, // Chọn màu sắc ngẫu nhiên
                'bien_the_kich_thuoc_id' => BienTheKichThuoc::inRandomOrder()->first()->id, // Chọn kích thước ngẫu nhiên
                'so_luong_bien_the' => $faker->optional()->numberBetween(1, 100),
                'gia_ban' => $faker->numberBetween(100000, 1000000), // Giá bán từ 100k đến 1 triệu
                'gia_khuyen_mai' => $faker->optional()->numberBetween(50000, 800000), // Giá khuyến mại tùy chọn
            ]);
        }
    }
}
