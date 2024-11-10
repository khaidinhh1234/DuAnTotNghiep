<?php

use App\Models\BienTheSanPham;
use App\Models\SanPham;
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
        Schema::table('danh_gias', function (Blueprint $table) {
            $table->dropForeign(['san_pham_id']);
            $table->dropForeign(['bien_the_san_pham_id']);
            $table->dropColumn('san_pham_id');
            $table->dropColumn('bien_the_san_pham_id');
            $table->dropColumn('anh_danh_gia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('danh_gias', function (Blueprint $table) {
            $table->foreignId('san_pham_id')->constrained()->cascadeOnDelete();
            $table->foreignId(column: 'bien_the_san_pham_id')->constrained()->cascadeOnDelete();
        });
    }
};
