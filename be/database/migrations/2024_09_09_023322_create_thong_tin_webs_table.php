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
        Schema::create('thong_tin_webs', function (Blueprint $table) {
            $table->id();
            $table->string('ten_doanh_nghiep')->nullable();
            $table->string('dia_chi')->nullable();
            $table->string('email')->nullable();
            $table->string('so_dien_thoai')->nullable();
            $table->string('cau_noi')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thong_tin_webs');
    }
};
