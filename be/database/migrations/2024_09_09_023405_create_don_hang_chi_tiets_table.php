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
                $table->foreignIdFor(DonHang::class)->constrained();
                $table->foreignIdFor(BienTheSanPham::class)->constrained();
                $table->bigInteger('so_luong');
                $table->decimal('gia', 15, 2);
                $table->decimal('thanh_tien', 15, 2);
                $table->primary(['don_hang_id', 'bien_the_san_pham_id']);
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
