<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // Thêm model User
use App\Models\DonHang; // Thêm model DonHang
use Faker\Factory as Faker;
class DonHangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) { // Tạo 10 đơn hàng
            DonHang::create([
                'user_id' => User::inRandomOrder()->first()->id, // Lấy user ngẫu nhiên
                'ghi_chu' => $faker->sentence(),
                'trang_thai_don_hang' => $faker->randomElement([
                    DonHang::TTDH_CXH,
                    DonHang::TTDH_DXH,
                    DonHang::TTDH_DXL,
                    DonHang::TTDH_DGH,
                    DonHang::TTDH_DGTC,
                    DonHang::TTDH_DH,
                    DonHang::TTDH_HH
                ]),
                'phuong_thuc_thanh_toan' => $faker->randomElement([
                    DonHang::PTTT_TT,
                    DonHang::PTTT_NH,
                    DonHang::PTTT_MM
                ]),
                'tong_tien_don_hang' => $faker->numberBetween(100000, 10000000), // Dùng số nguyên thay cho float
                'ten_nguoi_dat_hang' => $faker->name(),
                'so_dien_thoai_nguoi_dat_hang' => $faker->phoneNumber(),
                'dia_chi_nguoi_dat_hang' => $faker->address(),
                'ma_giam_gia' => $faker->optional()->word(),
                'so_tien_giam_gia' => $faker->optional()->numberBetween(10000, 500000), // Dùng số nguyên thay cho float
                'trang_thai_thanh_toan' => $faker->randomElement([
                    DonHang::TTTT_CTT, // Chưa thanh toán
                    DonHang::TTTT_DTT, // Đã thanh toán
                    DonHang::TTTT_DXL, // Đang xử lý
                    DonHang::TTTT_DH   // Đã hủy
                ]),
                'trang_thai_van_chuyen' => $faker->randomElement([
                    DonHang::TTVC_CXT,  // Chờ xuất kho
                    DonHang::TTVC_CLH,  // Chờ lấy hàng
                    DonHang::TTVC_DGH,  // Đang giao hàng
                    DonHang::TTVC_GHTC  // Giao hàng thành công
                ]),
                'ma_don_hang' => 'DH' . strtoupper(uniqid()), // Tạo mã đơn hàng ngẫu nhiên
            ]);
        }
    }
}

