<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\HangThanhVien; // Assuming this is the membership rank model
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $hangThanhViens = HangThanhVien::all();

        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'ho' => 'Họ ' . $i,
                'ten' => 'Tên ' . $i,
                'anh_nguoi_dung' => 'path_to_user_image_' . $i . '.jpg',
                'email' => 'user' . $i . '@example.com',
                'password' => bcrypt('password'),
                'so_dien_thoai' => '012345678' . $i,
                'dia_chi' => 'Địa chỉ ' . $i,
                'ngay_sinh' => now()->subYears(rand(20, 40)),
                'gioi_tinh' => User::TYPE_NAM,
                'hang_thanh_vien_id' => $hangThanhViens->random()->id,
            ]);
        }
    }
}
