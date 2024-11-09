<?php

use App\Models\BienTheSanPham;
use App\Models\DanhGia;
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
        Schema::create('danh_gia_san_phams', function (Blueprint $table) {
            $table->foreignIdFor(DanhGia::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(SanPham::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(BienTheSanPham::class)->constrained()->cascadeOnDelete();

            $table->primary(['danh_gia_id', 'san_pham_id', 'bien_the_san_pham_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gia_san_phams');
    }
};
