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
        Schema::create('tin_nhan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phong_ho_tro_id')->constrained('phong_ho_tro');
            $table->foreignId('nguoig_ui_id')->constrained('users');
            $table->text('noi_dung')->nullable();
            $table->string('hinh_anh')->nullable();
            $table->boolean('da_doc')->default(0); // Trạng thái đã đọc (0: chưa đọc, 1: đã đọc)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tin_nhan');
    }
};
