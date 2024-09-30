<?php

use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
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
        Schema::create('chuong_trinh_san_pham', function (Blueprint $table) {
            $table->foreignIdFor(SanPham::class)->constrained();
            $table->foreignIdFor(ChuongTrinhUuDai::class)->constrained();
            $table->primary(['san_pham_id', 'chuong_trinh_uu_dai_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chuong_trinh_san_pham');
    }
};
