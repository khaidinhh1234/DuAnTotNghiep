<?php

use App\Models\DanhGia;
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
        Schema::create('anh_danh_gias', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(DanhGia::class)->constrained();
            $table->string('anh_danh_gia')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anh_danh_gias');
    }
};
