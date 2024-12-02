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
        Schema::table('yeu_cau_rut_tiens', function (Blueprint $table) {
            $table->string('tai_khoan_ngan_hang')->after('so_tien');
            $table->string('ten_chu_tai_khoan')->after('tai_khoan_ngan_hang');
            $table->string('ngan_hang')->after('ten_chu_tai_khoan');
            $table->string('logo_ngan_hang')->after('ngan_hang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('yeu_cau_rut_tiens', function (Blueprint $table) {
            $table->dropColumn('tai_khoan_ngan_hang');
            $table->dropColumn('ten_chu_tai_khoan');
            $table->dropColumn('ngan_hang');
            $table->dropColumn('logo_ngan_hang');
        });
    }
};
