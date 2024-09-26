<?php

use App\Models\DanhMuc;
use App\Models\MaKhuyenMai;
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
        Schema::create('khuyen_mai_danh_muc', function (Blueprint $table) {
            $table->foreignIdFor(MaKhuyenMai::class)->constrained();
            $table->foreignIdFor(DanhMuc::class)->constrained();
            $table->primary(['ma_khuyen_mai_id', 'danh_muc_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khuyen_mai_danh_muc');
    }
};
