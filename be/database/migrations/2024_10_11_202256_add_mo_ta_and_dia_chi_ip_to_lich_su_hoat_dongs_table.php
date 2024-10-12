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
        Schema::table('lich_su_hoat_dongs', function (Blueprint $table) {
            $table->text('mo_ta')->after('nguoi_thao_tac');
            $table->string('dia_chi_ip')->after('mo_ta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lich_su_hoat_dongs', function (Blueprint $table) {
            $table->dropColumn(['mo_ta', 'dia_chi_ip']);
        });
    }
};
