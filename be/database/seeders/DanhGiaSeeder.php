<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use App\Models\User;
use App\Models\SanPham;
use App\Models\DonHang;
use Illuminate\Support\Facades\DB;

class DanhGiaSeeder extends Seeder
{
    public function run()
    {
        $data = [];
        $now = Carbon::now();
        $users = User::all()->pluck('id')->toArray(); // Lấy danh sách ID của User
        $sanPhams = SanPham::all()->pluck('id')->toArray(); // Lấy danh sách ID của SanPham
        $donHangs = DonHang::all()->pluck('id')->toArray(); // Lấy danh sách ID của DonHang

        for ($i = 1; $i <= 10; $i++) {
            $so_sao_san_pham = rand(1, 5); // Số sao ngẫu nhiên từ 1 đến 5
            $so_sao_dich_vu_van_chuyen = rand(1, 5); // Số sao dịch vụ vận chuyển ngẫu nhiên
            $chat_luong_san_pham = "Chất lượng sản phẩm đánh giá số " . $i;
            $mo_ta = "Mô tả đánh giá số " . $i;
            $phan_hoi = rand(0, 1) ? "Phản hồi đánh giá số " . $i : null;
            $huu_ich = rand(0, 100); // Số lượt hữu ích ngẫu nhiên

            $data[] = [
                'user_id' => $users[array_rand($users)],
                'san_pham_id' => $sanPhams[array_rand($sanPhams)],
                'don_hang_id' => $donHangs[array_rand($donHangs)],
                'so_sao_san_pham' => $so_sao_san_pham,
                'so_sao_dich_vu_van_chuyen' => $so_sao_dich_vu_van_chuyen,
                'chat_luong_san_pham' => $chat_luong_san_pham,
                'mo_ta' => $mo_ta,
                'phan_hoi' => $phan_hoi,
                'huu_ich' => $huu_ich,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('danh_gias')->insert($data);
    }
}
