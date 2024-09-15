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

        foreach ($sanPhams as $sanPham) {
            $bienTheMauSac = BienTheMauSac::inRandomOrder()->first();
            $bienTheKichThuoc = BienTheKichThuoc::inRandomOrder()->first();

            BienTheSanPham::create([
                'san_pham_id' => $sanPham->id,
                'bien_the_mau_sac_id' => $bienTheMauSac->id,
                'bien_the_kich_thuoc_id' => $bienTheKichThuoc->id,
                'gia_ban' => rand(100000, 500000),
                'gia_khuyen_mai' => rand(50000, 100000),
                'so_luong_bien_the' => rand(10, 100),
            ]);
        }
    }
}
