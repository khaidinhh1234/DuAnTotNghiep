<?php

namespace Database\Seeders;

use App\Models\HangThanhVien;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\DanhMuc;
use App\Models\SanPham;
use App\Models\BienTheMauSac;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheSanPham;
use App\Models\AnhBienThe;
use App\Models\BoSuuTap;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        HangThanhVien::create([
            'ten_hang_thanh_vien' => 'Hạng 1',
            'anh_hang_thanh_vien' => $faker->imageUrl(),
            'chi_tieu_toi_thieu' => 1000,
            'chi_tieu_toi_da' => 5000,
            'mo_ta' => 'Mô tả cho hạng 1',
        ]);

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
                'hang_thanh_vien_id' => 1,
            ]);
        }
        // Tạo 100 danh mục
        foreach (range(1, 100) as $index) {
            DanhMuc::create([
                'ten_danh_muc' => $faker->unique()->word() . '_' . $index, // Thêm index để đảm bảo uniqueness
                'cha_id' => null,
                'anh_danh_muc' => $faker->imageUrl(),
                'duong_dan' => $faker->slug(),
            ]);
        }

        // Tạo 100 sản phẩm
        foreach (range(1, 100) as $index) {
            SanPham::create([
                'danh_muc_id' => $faker->numberBetween(1, 100),
                'ten_san_pham' => $faker->unique()->sentence(3) . '_' . $index, // Thêm index
                'anh_san_pham' => $faker->imageUrl(),
                'ma_san_pham' => strtoupper($faker->lexify('???-???')) . '_' . $index, // Thêm index
                'duong_dan' => $faker->slug(),
                'mo_ta_ngan' => $faker->sentence(10),
                'noi_dung' => $faker->paragraph(),
                'luot_xem' => $faker->numberBetween(0, 1000),
                'trang_thai' => $faker->boolean(),
                'gia_tot' => $faker->boolean(),
                'hang_moi' => $faker->boolean(),
            ]);
        }

        // Tạo 50 biến thể màu sắc
        foreach (range(1, 50) as $index) {
            BienTheMauSac::create([
                'ten_mau_sac' => $faker->unique()->colorName() . '_' . $index, // Thêm index
                'ma_mau_sac' => $faker->hexColor(),
            ]);
        }

        foreach (range(1, 5) as $index) {
            $kieuKichThuoc = '';
            if ($index <= 7) {
                $kieuKichThuoc = ['XS', 'S', 'M', 'L', 'XL', 'XXL'][$index - 1];
            } elseif ($index <= 14) {
                $kieuKichThuoc = ['X', 'S', 'M', 'L', 'XL', 'XXL'][$index - 8];
            } else {
                $kieuKichThuoc = 'Size ' . ($index - 14);
            }

            BienTheKichThuoc::create([
                'kich_thuoc' => $kieuKichThuoc,
                'loai_kich_thuoc' => $index <= 7 ? 'nam' : ($index <= 14 ? 'nu' : 'tre_em'),
            ]);
        }



        foreach (range(1, 50) as $index) {
            BienTheSanPham::create([
                'san_pham_id' => $faker->numberBetween(1, 100), // Đảm bảo ID này tồn tại trong bảng san_phams
                'bien_the_mau_sac_id' => $faker->numberBetween(1, 10), // Tương tự cho các ID khác
                'bien_the_kich_thuoc_id' => $faker->numberBetween(1, 5), // Đảm bảo ID này tồn tại trong bien_the_kich_thuocs
                'so_luong_bien_the' => $faker->numberBetween(1, 100),
                'gia_ban' => $faker->randomFloat(2, 10, 1000),
                'gia_khuyen_mai' => $faker->randomFloat(2, 0, 500),
                'gia_khuyen_mai_tam_thoi' => $faker->randomFloat(2, 0, 500),
            ]);
        }

        // Tạo 100 ảnh biến thể
        foreach (range(1, 100) as $index) {
            AnhBienThe::create([
                'bien_the_san_pham_id' => $faker->numberBetween(1, 50),
                'duong_dan_anh' => $faker->imageUrl(),
            ]);
        }

        // Tạo 10 bộ sưu tập
        foreach (range(1, 10) as $index) {
            BoSuuTap::create([
                'ten' => $faker->unique()->sentence(2) . '_' . $index, // Thêm index
                'duong_dan' => $faker->slug(),
                'duong_dan_anh' => $faker->imageUrl(),
            ]);
        }

        for ($i = 1; $i <= 10; $i++) {
            DB::table('bo_suu_tap_san_pham')->insert([
                'bo_suu_tap_id' => $i,
                'san_pham_id' => $faker->numberBetween(1, 100),
            ]);
        }


        // Tạo 50 đơn hàng
        foreach (range(1, 50) as $index) {
            DonHang::create([
                'ma_don_hang' => strtoupper($faker->unique()->lexify('DH???')) . '_' . $index, // Thêm index
                'user_id' => $faker->numberBetween(1, 2),
                'ghi_chu' => $faker->sentence(),
                'trang_thai_don_hang' => $faker->randomElement(['Hoàn tất đơn hàng']),
                'phuong_thuc_thanh_toan' => $faker->randomElement(['Thanh tóan qua ngân hàng']),
                'tong_tien_don_hang' => $faker->numberBetween(50000, 500000),
                'ten_nguoi_dat_hang' => $faker->name(),
                'so_dien_thoai_nguoi_dat_hang' => $faker->phoneNumber(),
                'dia_chi_nguoi_dat_hang' => $faker->address(),
                'ma_giam_gia' => strtoupper($faker->lexify('GG???')) . '_' . $index, // Thêm index
                'so_tien_giam_gia' => $faker->numberBetween(0, 50000),
                'trang_thai_thanh_toan' => $faker->randomElement(['Đã thanh toán']),
                'duong_dan' => $faker->slug(),
                'ngay_hoan_thanh_don' => $faker->dateTimeBetween('-1 month', 'now'),
            ]);
        }

        // Tạo 100 chi tiết đơn hàng
        foreach (range(1, 100) as $index) {
            DonHangChiTiet::create([
                'don_hang_id' => $faker->numberBetween(1, 50),
                'bien_the_san_pham_id' => $faker->numberBetween(1, 50),
                'so_luong' => $faker->numberBetween(1, 5),
                'gia' => $faker->numberBetween(10000, 200000),
                'thanh_tien' => $faker->numberBetween(10000, 200000),
            ]);
        }
    }
}
