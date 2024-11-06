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
        Schema::table('giao_dich_vis', function (Blueprint $table) {
            $table->enum('loai_giao_dich', ['hoan_tien', 'rut_tien', 'thanh_toan', 'nap_tien'])->after('ma_giao_dich')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('giao_dich_vis', function (Blueprint $table) {
            $table->dropColumn('loai_giao_dich');
        });
    }
};
