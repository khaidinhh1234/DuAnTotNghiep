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
            $table->string('ten_website');
            $table->string('logo_website');
            $table->string('ten_doanh_nghiep');
            $table->string('dia_chi');
            $table->string('email');
            $table->string('so_dien_thoai_dat_hang', 15);
            $table->string('so_dien_thoai_khieu_nai', 15);
            $table->text('cau_noi')->nullable();
            $table->json('banner');
            $table->json('noi_dung_banner');
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
