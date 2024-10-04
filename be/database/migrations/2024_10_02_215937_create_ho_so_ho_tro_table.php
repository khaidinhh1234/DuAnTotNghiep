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
        Schema::create('ho_so_ho_tro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phong_ho_tro_id')->constrained('phong_ho_tro');
            $table->text('mo_ta'); // Mô tả hồ sơ
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ho_so_ho_tro');
    }
};
