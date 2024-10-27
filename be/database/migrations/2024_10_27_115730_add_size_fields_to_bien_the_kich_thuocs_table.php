<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bien_the_kich_thuocs', function (Blueprint $table) {
            $table->integer('chieu_cao_toi_thieu')->nullable()->after('loai_kich_thuoc');
            $table->integer('chieu_cao_toi_da')->nullable()->after('chieu_cao_toi_thieu');
            $table->integer('can_nang_toi_thieu')->nullable()->after('chieu_cao_toi_da');
            $table->integer('can_nang_toi_da')->nullable()->after('can_nang_toi_thieu');
        });
    }

    public function down(): void
    {
        Schema::table('bien_the_kich_thuocs', function (Blueprint $table) {
            $table->dropColumn(['chieu_cao_toi_thieu', 'chieu_cao_toi_da', 'can_nang_toi_thieu', 'can_nang_toi_da']);
        });
    }
};
