<?php

namespace Database\Seeders;

use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\BienTheSanPham;
use App\Models\SanPham;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BienTheSanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $sanPhams = SanPham::all();
        $mauSacs = BienTheMauSac::all();
        $kichThuocs = BienTheKichThuoc::all();

        for ($i = 1; $i <= 10; $i++) {
            BienTheSanPham::create([
                'san_pham_id' => $sanPhams->random()->id,
                'bien_the_mau_sac_id' => $mauSacs->random()->id,
                'bien_the_kich_thuoc_id' => $kichThuocs->random()->id,
                'so_luong_bien_the' => rand(10, 100),
            ]);
        }
    }
}
