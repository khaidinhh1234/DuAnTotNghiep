<?php

use App\Models\BienTheSanPham;
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
        Schema::create('anh_bien_thes', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(BienTheSanPham::class)->constrained();
            $table->string('ten_anh')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anh_bien_thes');
    }
};
