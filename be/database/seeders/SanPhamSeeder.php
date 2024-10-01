<?php

namespace Database\Seeders;

use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class SanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            SanPham::create([
                'danh_muc_id' => DanhMuc::inRandomOrder()->first()->id, // Chọn danh mục ngẫu nhiên
                'ten_san_pham' => $faker->unique()->word(),
                'anh_san_pham' => $faker->optional()->imageUrl(640, 480, 'products', true, 'Faker'),
                'ma_san_pham' => 'SP' . strtoupper(uniqid()), // Tạo mã sản phẩm ngẫu nhiên
                'duong_dan' => $faker->slug(),
                'mo_ta_ngan' => $faker->optional()->sentence(),
                'noi_dung' => $faker->optional()->text(),
                'gia_tri_uu_dai' => $faker->optional()->randomElement(['10%', '20%', '30%']),
                'luot_xem' => $faker->numberBetween(0, 1000),
                'trang_thai' => $faker->boolean(80), // 80% là sản phẩm có sẵn
                'gia_tot' => $faker->boolean(20), // 20% là sản phẩm có giá tốt
                'hang_moi' => $faker->boolean(50), // 50% là sản phẩm mới
            ]);
        }
    }
}
