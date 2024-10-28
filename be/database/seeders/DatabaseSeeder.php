<?php

namespace Database\Seeders;

use App\Models\{User, HangThanhVien, DanhMuc, SanPham, BienTheMauSac, BienTheKichThuoc, BienTheSanPham, AnhBienThe, BoSuuTap, DonHang, DonHangChiTiet};
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $this->seedDanhMuc($faker);
        $this->seedSanPham($faker);
        $this->seedBienTheKichThuoc();
        $this->seedBienTheSanPham($faker);
        $this->seedAnhBienThe($faker);
        $this->seedBoSuuTap($faker);
        $this->seedBoSuuTapSanPham($faker);
        $this->seedDonHang($faker);
        $this->seedDonHangChiTiet($faker);
    }

    private function seedDanhMuc($faker)
    {
        foreach (range(1, 100) as $index) {
            DanhMuc::create([
                'ten_danh_muc' => $faker->unique()->word() . "_{$index}",
                'cha_id' => null,
                'anh_danh_muc' => $faker->imageUrl(),
                'duong_dan' => $faker->slug(),
            ]);
        }
    }

    private function seedSanPham($faker)
    {
        foreach (range(1, 100) as $index) {
            SanPham::create([
                'danh_muc_id' => $faker->numberBetween(1, 100),
                'ten_san_pham' => $faker->unique()->sentence(3) . "_{$index}",
                'anh_san_pham' => $faker->imageUrl(),
                'ma_san_pham' => strtoupper($faker->lexify('???-???')) . "_{$index}",
                'duong_dan' => $faker->slug(),
                'mo_ta_ngan' => $faker->sentence(10),
                'noi_dung' => $faker->paragraph(),
                'luot_xem' => $faker->numberBetween(0, 1000),
                'trang_thai' => $faker->boolean(),
                'gia_tot' => $faker->boolean(),
                'hang_moi' => $faker->boolean(),
            ]);
        }
    }

    private function seedBienTheKichThuoc()
    {
        foreach (range(1, 5) as $index) {
            $kieuKichThuoc = match (true) {
                $index <= 7 => ['XS', 'S', 'M', 'L', 'XL', 'XXL'][$index - 1],
                $index <= 14 => ['X', 'S', 'M', 'L', 'XL', 'XXL'][$index - 8],
                default => 'Size ' . ($index - 14)
            };

            BienTheKichThuoc::create([
                'kich_thuoc' => $kieuKichThuoc,
                'loai_kich_thuoc' => $index <= 7 ? 'nam' : ($index <= 14 ? 'nu' : 'tre_em'),
            ]);
        }
    }

    private function seedBienTheSanPham($faker)
    {
        foreach (range(1, 50) as $index) {
            BienTheSanPham::create([
                'san_pham_id' => $faker->numberBetween(1, 100),
                'bien_the_mau_sac_id' => $faker->numberBetween(1, 5),
                'bien_the_kich_thuoc_id' => $faker->numberBetween(1, 5),
                'so_luong_bien_the' => $faker->numberBetween(1, 100),
                'gia_ban' => $faker->randomFloat(2, 10, 1000),
                'gia_khuyen_mai' => $faker->randomFloat(2, 0, 500),
                'gia_khuyen_mai_tam_thoi' => $faker->randomFloat(2, 0, 500),
            ]);
        }
    }

    private function seedAnhBienThe($faker)
    {
        foreach (range(1, 100) as $index) {
            AnhBienThe::create([
                'bien_the_san_pham_id' => $faker->numberBetween(1, 50),
                'duong_dan_anh' => $faker->imageUrl(),
            ]);
        }
    }

    private function seedBoSuuTap($faker)
    {
        foreach (range(1, 10) as $index) {
            BoSuuTap::create([
                'ten' => $faker->unique()->sentence(2) . "_{$index}",
                'duong_dan' => $faker->slug(),
                'duong_dan_anh' => $faker->imageUrl(),
            ]);
        }
    }

    private function seedBoSuuTapSanPham($faker)
    {
        foreach (range(1, 10) as $index) {
            DB::table('bo_suu_tap_san_pham')->insert([
                'bo_suu_tap_id' => $index,
                'san_pham_id' => $faker->numberBetween(1, 100),
            ]);
        }
    }

    private function seedDonHang($faker)
    {
        foreach (range(1, 50) as $index) {
            DonHang::create([
                'ma_don_hang' => strtoupper($faker->unique()->lexify('DH???')) . "_{$index}",
                'user_id' => $faker->numberBetween(1, 2),
                'ghi_chu' => $faker->sentence(),
                'trang_thai_don_hang' => 'Hoàn tất đơn hàng',
                'phuong_thuc_thanh_toan' => 'Thanh toán qua ngân hàng',
                'tong_tien_don_hang' => $faker->numberBetween(50000, 500000),
                'ten_nguoi_dat_hang' => $faker->name(),
                'so_dien_thoai_nguoi_dat_hang' => $faker->phoneNumber(),
                'dia_chi_nguoi_dat_hang' => $faker->address(),
                'ma_giam_gia' => strtoupper($faker->lexify('GG???')) . "_{$index}",
                'so_tien_giam_gia' => $faker->numberBetween(0, 50000),
                'trang_thai_thanh_toan' => 'Đã thanh toán',
                'duong_dan' => $faker->slug(),
                'ngay_hoan_thanh_don' => $faker->dateTimeBetween('-1 month', 'now'),
            ]);
        }
    }

    private function seedDonHangChiTiet($faker)
    {
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
