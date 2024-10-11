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
        Schema::table('bien_the_san_phams', function (Blueprint $table) {
            $table->integer('chi_phi_san_xuat')->nullable()->after('so_luong_bien_the');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bien_the_san_phams', function (Blueprint $table) {
            $table->dropColumn('chi_phi_san_xuat');
        });
    }
};
