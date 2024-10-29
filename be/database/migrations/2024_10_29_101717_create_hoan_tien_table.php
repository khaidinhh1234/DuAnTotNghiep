<?php

use App\Models\DonHang;
use App\Models\GiaoDichVi;
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
        Schema::create('hoan_tiens', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(DonHang::class)->constrained();
            $table->foreignIdFor(GiaoDichVi::class)->constrained();
            $table->integer('so_tien_hoan');
            $table->string('ly_do', 255)->nullable();
            $table->dateTime('thoi_gian_hoan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoan_tiens');
    }
};
