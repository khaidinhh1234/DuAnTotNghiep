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
            $table->string('ten_website')->nullable();
            $table->string('logo_website')->nullable();
            $table->string('ten_doanh_nghiep')->nullable();
            $table->string('dia_chi')->nullable();
            $table->string('email')->nullable();
            $table->string('so_dien_thoai_dat_hang', 15)->nullable();
            $table->string('so_dien_thoai_khieu_nai', 15)->nullable();
            $table->string('cau_noi')->nullable();
            $table->string('link_facebook')->nullable();
            $table->string('link_youtube')->nullable();
            $table->string('link_zalo')->nullable();
            $table->string('link_instagram')->nullable();
            $table->string('link_tiktok')->nullable();
            $table->timestamps();
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
