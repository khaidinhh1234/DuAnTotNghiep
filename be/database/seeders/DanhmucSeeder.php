<?php

namespace Database\Seeders;

use App\Models\DanhMuc;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DanhmucSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            DanhMuc::create([
                'ten_danh_muc' => 'Danh Mục ' . $i,
                'cha_id' => null,
                'anh_danh_muc' => 'path_to_image_' . $i . '.jpg',
                'duong_dan' => 'danh-muc-' . $i,
            ]);
        }
    }
}
