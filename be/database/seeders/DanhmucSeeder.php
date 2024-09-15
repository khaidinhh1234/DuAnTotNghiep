<?php

namespace Database\Seeders;

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
            DB::table('danh_mucs')->insert([
                'ten_danh_muc' => 'Danh mục ' . $i,
                'cha_id' => $i > 1 ? rand(1, $i - 1) : null, // Random cha_id cho các danh mục từ 2 trở đi
                'duong_dan' => Str::slug('Danh mục ' . $i),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
