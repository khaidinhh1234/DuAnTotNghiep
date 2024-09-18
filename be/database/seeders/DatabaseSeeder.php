<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\HangThanhVien;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
//
//                $mangKichThuoc = ['XS', 'S', 'M', 'L', 'XL'];
//        foreach ($mangKichThuoc as $kichThuoc) {
//            \App\Models\BienTheKichThuoc::create([
//                'kich_thuoc' => $kichThuoc,
//            ]);
//        }
//
//        $mangMauSac = [['Đỏ','#FF0000'], ['Đen','#000000']];
//
//        foreach ($mangMauSac as $mauSac) {
//            \App\Models\BienTheMauSac::create([
//                'ten_mau_sac' => $mauSac[0],
//                'ma_mau_sac' => $mauSac[1],
//            ]);
//        }

        // for ($i = 1; $i < 10; $i++) {
        //     \App\Models\DanhMuc::query()->create([
        //         'ten_danh_muc' => 'Danh mục ' . $i,
        //     ]);
        // }

        // for ($i = 1; $i < 10; $i++) {
        //     \App\Models\The::query()->create([
        //         'ten_the' => 'Thẻ ' . $i,
        //     ]);
        // }

        $hangThanhViens = [
            ['ten_hang_thanh_vien' => 'Vàng', 'chi_tieu_toi_thieu' => '5000000'],
            ['ten_hang_thanh_vien' => 'Bạc', 'chi_tieu_toi_thieu' => '1000000'],
            ['ten_hang_thanh_vien' => 'Đồng', 'chi_tieu_toi_thieu' => '0'],
        ];
        foreach ($hangThanhViens as $hangThanhVien) {
            HangThanhVien::query()->create([
                'ten_hang_thanh_vien' => $hangThanhVien['ten_hang_thanh_vien'],
                'chi_tieu_toi_thieu' => $hangThanhVien['chi_tieu_toi_thieu'],
            ]);
        }
    }
}
