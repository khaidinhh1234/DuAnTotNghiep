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
        Schema::table('vi_tiens', function (Blueprint $table) {
            $table->string('ma_xac_minh')->after('so_du')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vi_tiens', function (Blueprint $table) {
            $table->dropColumn('ma_xac_minh');
        });
    }
};
