<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MaKhuyenMaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [];
        for ($i = 1; $i <= 10; $i++) {
            $data[] = [
                'ma_code' => 'CODE' . $i,
                'mo_ta' => 'Mô tả mã giảm giá ' . $i,
                'giam_gia' => $i * 10, // Giảm giá tăng dần 10, 20, 30, ...
                'loai' => $i % 2 == 0 ? 'phan_tram' : 'tien_mat', // Loại xen kẽ giữa phần trăm và tiền mặt
                'so_luong_da_su_dung' => 0,
                'so_luong' => 100 + $i, // Số lượng mã tăng dần
                'ngay_bat_dau_suu_tam' => Carbon::now(),
                'ngay_bat_dau' => Carbon::now(),
                'ngay_ket_thuc' => Carbon::now()->addDays(30),
                'trang_thai' => 1, // Mã hoạt động
                'chi_tieu_toi_thieu' => 100000 * $i, // Chi tiêu tối thiểu tăng dần
                'ap_dung' => 'Áp dụng cho mã số ' . $i,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null
            ];
        }

        DB::table('ma_khuyen_mais')->insert($data);
    }
}
