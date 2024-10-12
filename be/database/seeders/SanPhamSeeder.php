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
                'ten_san_pham' => $faker->unique()->word(), // Tên sản phẩm duy nhất
                'anh_san_pham' => $faker->optional()->imageUrl(640, 480, 'products', true), // Ảnh sản phẩm ngẫu nhiên
                'ma_san_pham' => strtoupper($faker->unique()->bothify('SP##??')), // Mã sản phẩm duy nhất
                'duong_dan' => $faker->slug(), // Đường dẫn URL ngẫu nhiên
                'mo_ta_ngan' => $faker->optional()->sentence(), // Mô tả ngắn
                'noi_dung' => $faker->optional()->paragraph(), // Nội dung mô tả sản phẩm
                'luot_xem' => $faker->numberBetween(0, 10000), // Số lượt xem ngẫu nhiên
                'trang_thai' => $faker->boolean(80), // Xác suất 80% là trạng thái đang hoạt động (1)
                'gia_tot' => $faker->boolean(50), // Xác suất 50% là giá tốt
                'hang_moi' => $faker->boolean(70), // Xác suất 70% là sản phẩm mới
            ]);
        }
    }
}
