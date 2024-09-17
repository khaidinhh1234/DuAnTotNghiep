<?php

namespace Database\Seeders;

use App\Models\BienTheMauSac;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BienTheMauSacSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $mauSacs = [
            ['ten_mau_sac' => 'Đỏ', 'ma_mau_sac' => '#FF0000'],
            ['ten_mau_sac' => 'Xanh lá', 'ma_mau_sac' => '#00FF00'],
            ['ten_mau_sac' => 'Xanh dương', 'ma_mau_sac' => '#0000FF'],
            ['ten_mau_sac' => 'Vàng', 'ma_mau_sac' => '#FFFF00'],
            ['ten_mau_sac' => 'Trắng', 'ma_mau_sac' => '#FFFFFF'],
        ];

        foreach ($mauSacs as $mauSac) {
            BienTheMauSac::create($mauSac);
        }
    }
}
