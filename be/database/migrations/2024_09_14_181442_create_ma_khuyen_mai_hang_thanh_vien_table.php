<?php

use App\Models\HangThanhVien;
use App\Models\MaKhuyenMai;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ma_khuyen_mai_hang_thanh_vien', function (Blueprint $table) {
            $table->foreignIdFor(MaKhuyenMai::class)->constrained();
            $table->foreignIdFor(HangThanhVien::class)->constrained();
            $table->primary(['ma_khuyen_mai_id', 'hang_thanh_vien_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ma_khuyen_mai_hang_thanh_vien');
    }
};
