<?php

use App\Models\AnhBienThe;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
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
        Schema::create('bien_the_san_phams', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(SanPham::class)->constrained();
            $table->foreignIdFor(BienTheMauSac::class)->constrained();
            $table->foreignIdFor(BienTheKichThuoc::class)->constrained();
            $table->integer('so_luong_bien_the')->nullable();
            $table->integer('gia_ban');
            $table->integer('gia_khuyen_mai')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bien_the_san_phams');
    }
};
