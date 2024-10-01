<?php

use App\Models\BienTheSanPham;
use App\Models\DonHang;
use App\Models\GioHangChiTiet;
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
        Schema::create('don_hang_chi_tiets', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(DonHang::class)->constrained();
            $table->foreignIdFor(BienTheSanPham::class)->constrained();
            $table->bigInteger('so_luong');
            $table->integer('gia');
            $table->integer('thanh_tien');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hang_chi_tiets');
    }
};
