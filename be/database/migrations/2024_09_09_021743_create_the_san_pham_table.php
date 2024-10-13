<?php

use App\Models\BoSuuTap;
use App\Models\SanPham;
use App\Models\The;
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
        Schema::create('bo_suu_tap_san_pham', function (Blueprint $table) {
            $table->foreignIdFor(SanPham::class)->constrained();
            $table->foreignIdFor(BoSuuTap::class)->constrained();
            $table->primary(['san_pham_id', 'bo_suu_tap_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('the_san_pham');
    }
};
