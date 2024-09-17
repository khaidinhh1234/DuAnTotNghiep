<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::table('users')->insert([
                'ho' => Str::random(5),
                'ten' => Str::random(5),
                'anh_nguoi_dung' => 'https://example.com/image' . $i . '.jpg', // Thêm đường dẫn ảnh mẫu
                'email' => 'user' . $i . '@example.com',
                'email_verified_at' => Carbon::now(),
                'password' => bcrypt('password'),
                'so_dien_thoai' => '098765432' . rand(1, 9),
                'dia_chi' => 'Address ' . $i,
                'ngay_sinh' => Carbon::createFromDate(rand(1980, 2005), rand(1, 12), rand(1, 28)),
                'gioi_tinh' => User::TYPE_NAM, // hoặc sử dụng logic để random
                'remember_token' => Str::random(10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ]);
        }
    }

}
