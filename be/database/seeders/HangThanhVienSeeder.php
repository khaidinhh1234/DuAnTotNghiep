<?php

namespace Database\Seeders;

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
        $data = [];
        $now = Carbon::now();

        for ($i = 1; $i <= 10; $i++) {
            $data[] = [
                'ten_hang_thanh_vien' => 'Hạng Thành Viên ' . $i,
                'chi_tieu_toi_thieu' => rand(1000, 5000),
                'chi_tieu_toi_da' => rand(5000, 10000),
                'ngay_bat_dau' => $now->subDays(rand(1, 30)),
                'ngay_ket_thuc' => $now->addDays(rand(30, 365)),
                'mo_ta' => 'Mô tả về hạng thành viên ' . $i,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('hang_thanh_viens')->insert($data);
    }
}
