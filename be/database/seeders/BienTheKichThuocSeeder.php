<?php

namespace Database\Seeders;

use App\Models\BienTheKichThuoc;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BienTheKichThuocSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $kichThuocs = ['S', 'M', 'L', 'XL', 'XXL'];

        foreach ($kichThuocs as $kichThuoc) {
            BienTheKichThuoc::create([
                'kich_thuoc' => $kichThuoc,
            ]);
        }
    }
}
