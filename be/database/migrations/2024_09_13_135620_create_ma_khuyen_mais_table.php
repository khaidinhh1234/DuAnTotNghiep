<?php

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
        Schema::create('ma_khuyen_mais', function (Blueprint $table) {
            $table->id();
            $table->string('ma_code')->unique();
            $table->string('mo_ta');
            $table->string('giam_gia');
            $table->enum('loai', ['phan_tram', 'tien_mat']);
            $table->unsignedInteger('so_luong')->default(1);
            $table->dateTime('ngay_bat_dau');
            $table->dateTime('ngay_ket_thuc')->nullable();
            $table->unsignedDecimal('chi_tieu_toi_thieu', 10, 2)->nullable();
            $table->unsignedDecimal('tong_giam_gia_toi_da', 10, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ma_khuyen_mais');
    }
};
