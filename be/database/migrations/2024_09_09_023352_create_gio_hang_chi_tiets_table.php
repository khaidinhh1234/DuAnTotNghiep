<?php

use App\Models\BienTheSanPham;
use App\Models\GioHang;
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
        Schema::create('gio_hang_chi_tiets', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(GioHang::class)->constrained();
            $table->foreignIdFor(BienTheSanPham::class)->constrained();
            $table->integer('so_luong')->nullable();
            $table->integer('gia')->nullable();
            $table->integer('tong_tien_gio_hang_chi_tiet')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gio_hang_chi_tiets');
    }
};
