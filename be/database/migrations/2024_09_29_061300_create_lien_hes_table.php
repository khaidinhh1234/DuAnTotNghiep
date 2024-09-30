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
        Schema::create('lien_hes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tai_khoan_lien_he_id')->nullable()->constrained('users');
            $table->string('ten_lien_he');
            $table->string('sdt_lien_he');
            $table->string('email_lien_he');
            $table->text('noi_dung_lien_he');
            $table->enum('loai_lien_he', ['ho_tro', 'bao_gia', 'phan_hoi', 'khac'])->default('khac');
            $table->enum('trang_thai_lien_he', ['chua_xu_ly', 'dang_xu_ly', 'da_xu_ly'])->default('chua_xu_ly');
            $table->foreignId('nguoi_phu_trach_id')->nullable()->constrained('users');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lien_hes');
    }
};
