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
        Schema::table('lien_hes', function (Blueprint $table) {
            $table->enum('loai_lien_he', ['ho_tro', 'bao_gia', 'phan_hoi', 'khac'])
                ->default('khac')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lien_hes', function (Blueprint $table) {
            $table->enum('loai_lien_he', ['ho_tro', 'bao_gia', 'phan_hoi', 'thong_bao_san_pham_moi', 'bo_suu_tap', 'khac'])
            ->default('khac')
            ->change();
        });
    }
};
