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
            $table->integer('gia_khuyen_mai_tam_thoi')->nullable()->after('gia_khuyen_mai');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bien_the_san_phams', function (Blueprint $table) {
            $table->dropColumn('gia_khuyen_mai_tam_thoi');
        });
    }
};
