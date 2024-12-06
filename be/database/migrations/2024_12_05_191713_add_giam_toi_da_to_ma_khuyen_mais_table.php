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
            $table->string('giam_toi_da')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('yeu_cau_rut_tiens', function (Blueprint $table) {
            $table->dropColumn('giam_toi_da');
        });
    }
};
