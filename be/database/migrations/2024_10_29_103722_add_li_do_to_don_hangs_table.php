<?php

use App\Models\DonHang;
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
        Schema::table('don_hangs', function (Blueprint $table) {
            $table->enum('li_do_hoan_hang', allowed: [DonHang::HH_SPL,DonHang::HH_SPSMT,DonHang::HH_SPQH,])->nullable();
            $table->enum('li_do_huy_hang', [DonHang::HH_TDTT, DonHang::HH_TDSP, DonHang::HH_TTRR,DonHang::HH_TDNMH])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('don_hangs', function (Blueprint $table) {
            $table->dropColumn('li_do_hoan_hang');
            $table->dropColumn('li_do_huy_hang');
        });
    }
};
