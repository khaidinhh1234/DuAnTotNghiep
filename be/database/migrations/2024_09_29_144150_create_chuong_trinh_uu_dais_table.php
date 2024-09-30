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
        Schema::create('chuong_trinh_uu_dais', function (Blueprint $table) {
            $table->id();
            $table->string('ten_uu_dai');
            $table->string('duong_dan')->unique();
            $table->string('duong_dan_anh')->nullable();
            $table->text('mo_ta')->nullable();
            $table->dateTime('ngay_hien_thi');
            $table->dateTime('ngay_bat_dau');
            $table->dateTime('ngay_ket_thuc');
            $table->integer('gia_tri_uu_dai');
            $table->enum('loai', ['tien', 'phan_tram']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chuong_trinh_uu_dais');
    }
};
