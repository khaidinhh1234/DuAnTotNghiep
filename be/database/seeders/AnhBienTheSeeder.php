<?php

namespace Database\Seeders;

use App\Models\AnhBienThe;
use App\Models\BienTheSanPham;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnhBienTheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $bienTheSanPhams = BienTheSanPham::all();

        for ($i = 1; $i <= 10; $i++) {
            AnhBienThe::create([
                'bien_the_san_pham_id' => $bienTheSanPhams->random()->id,
                'duong_dan_anh' => 'path_to_variant_image_' . $i . '.jpg',
            ]);
        }
    }
}
