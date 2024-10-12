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

        for ($i = 0; $i < 10; $i++) {
            DonHang::create([
                'ma_don_hang' => 'DH' . strtoupper(uniqid()), // Mã đơn hàng ngẫu nhiên
                'user_id' => User::inRandomOrder()->first()->id, // Người dùng ngẫu nhiên
                'ghi_chu' => $faker->optional()->sentence(),
                'trang_thai_don_hang' => $faker->randomElement([
                    DonHang::TTDH_CXH,   // Chờ xác nhận
                    DonHang::TTDH_DXH,   // Đã xác nhận
                    DonHang::TTDH_DXL,   // Đang xử lý
                    DonHang::TTDH_DGH,   // Đang giao hàng
                    DonHang::TTDH_CKHCN, // Chờ khách hàng nhận
                    DonHang::TTDH_HTDH,  // Hoàn thành đơn hàng
                    DonHang::TTDH_DHTB,  // Đã thất bại
                    DonHang::TTDH_DH,    // Đã hủy
                    DonHang::TTDH_HH     // Hoàn hàng
                ]),
                'phuong_thuc_thanh_toan' => $faker->randomElement([
                    DonHang::PTTT_TT,  // Thanh toán tiền mặt
                    DonHang::PTTT_NH,  // Chuyển khoản ngân hàng
                    DonHang::PTTT_MM   // Thanh toán MOMO
                ]),
                'tong_tien_don_hang' => $faker->numberBetween(100000, 10000000),
                'ten_nguoi_dat_hang' => $faker->name(),
                'so_dien_thoai_nguoi_dat_hang' => $faker->phoneNumber(),
                'dia_chi_nguoi_dat_hang' => $faker->address(),
                'ma_giam_gia' => $faker->optional()->word(),
                'so_tien_giam_gia' => $faker->optional()->numberBetween(10000, 500000),
                'trang_thai_thanh_toan' => $faker->randomElement([
                    DonHang::TTTT_CTT, // Chưa thanh toán
                    DonHang::TTTT_DTT  // Đã thanh toán
                ]),
                'duong_dan' => $faker->optional()->url(),
                'ngay_hoan_thanh_don' => $faker->optional()->dateTimeBetween('-1 years', 'now'), // Ngày hoàn thành đơn hàng
            ]);
        }
    }
}

