<?php

namespace Database\Seeders;

use App\Models\HangThanhVien;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HangThanhVienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            HangThanhVien::create([
                'ten_hang_thanh_vien' => 'Hạng Thành Viên ' . $i,
                'anh_hang_thanh_vien' => 'path_to_image/hang_thanh_vien_' . $i . '.jpg', // Thay đổi đường dẫn ảnh nếu cần
                'chi_tieu_toi_thieu' => rand(1000, 5000) * $i, // Giá trị ngẫu nhiên
                'chi_tieu_toi_da' => rand(5000, 10000) * $i, // Giá trị ngẫu nhiên
                'ngay_bat_dau' => Carbon::now()->subMonths(rand(1, 12)), // Ngày bắt đầu ngẫu nhiên từ 1-12 tháng trước
                'ngay_ket_thuc' => Carbon::now()->addMonths(rand(1, 12)), // Ngày kết thúc ngẫu nhiên từ 1-12 tháng sau
                'mo_ta' => 'Mô tả cho hạng thành viên ' . $i,
            ]);
        }
    }
}
