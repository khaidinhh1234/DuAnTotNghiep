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
        for ($i = 1; $i <= 10; $i++) {
            BienTheMauSac::create([
                'ten_mau_sac' => 'Màu Sắc ' . $i,
                'ma_mau_sac' => 'MS' . $i,
            ]);
        }
    }
}
