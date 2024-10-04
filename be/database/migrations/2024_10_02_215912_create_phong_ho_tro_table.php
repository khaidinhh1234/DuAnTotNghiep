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
        Schema::create('phong_ho_tro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('khach_hang_id')->constrained('users');
            $table->foreignId('nhan_vien_id')->constrained('users');
            $table->enum('trang_thai',['hoan_thanh','chua_hoan_thanh','dang_ho_tro','dang_tiep_nhan'])->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phong_ho_tro');
    }
};
