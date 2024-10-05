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
        Schema::table('ma_khuyen_mais', function (Blueprint $table) {
            $table->text('ap_dung')->after('chi_tieu_toi_thieu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ma_khuyen_mais', function (Blueprint $table) {
            $table->dropColumn('ap_dung');
        });
    }
};
