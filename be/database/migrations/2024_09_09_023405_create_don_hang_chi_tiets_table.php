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
                $table->decimal('gia', 15, 2);
                $table->string('ten_mau_bien_the_san_pham');
                $table->string('ten_kich_thuoc_bien_the_san_pham');
                $table->decimal('thanh_tien', 15, 2);
                $table->string('duong_dan')->nullable();
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
