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
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) { // Tạo 10 người dùng
            User::create([
                'hang_thanh_vien_id' => HangThanhVien::inRandomOrder()->first()->id, // Lấy hạng thành viên ngẫu nhiên
                'ho' => $faker->lastName(),
                'ten' => $faker->firstName(),
                'anh_nguoi_dung' => $faker->optional()->imageUrl(200, 200, 'people', true, 'User'), // Tạo ảnh ngẫu nhiên
                'email' => $faker->unique()->safeEmail(),
                'password' => bcrypt('password'), // Mật khẩu mặc định
                'so_dien_thoai' => Str::limit($faker->phoneNumber(), 15, ''),
                'dia_chi' => $faker->address(),
                'ngay_sinh' => $faker->date(),
                'gioi_tinh' => $faker->randomElement([User::TYPE_NAM, User::TYPE_NU, User::TYPE_KHAC]),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);
        }
    }
}
