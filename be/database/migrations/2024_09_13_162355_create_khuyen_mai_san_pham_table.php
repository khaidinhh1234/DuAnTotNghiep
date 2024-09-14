<?php

use App\Models\MaKhuyenMai;
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
        Schema::create('khuyen_mai_san_pham', function (Blueprint $table) {
            $table->foreignIdFor(SanPham::class)->constrained();
            $table->foreignIdFor(MaKhuyenMai::class)->constrained();
            $table->primary(['san_pham_id', 'ma_khuyen_mai_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khuyen_mai_san_pham');
    }
};
