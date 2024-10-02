<?php

use App\Models\DonHang;
use App\Models\VanChuyen;
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
        Schema::create('van_chuyens', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(DonHang::class)->constrained();
            $table->string('ma_van_chuyen');
            $table->date('ngay_tao');
            $table->enum('trang_thai_van_chuyen',  [VanChuyen::TTVC_CXL, VanChuyen::TTVC_DGH, VanChuyen::TTVC_GHTC, VanChuyen::TTVC_GHTB])->default(VanChuyen::TTVC_CXL);
            $table->enum('cod', [VanChuyen::TTCOD_CN, VanChuyen::TTCOD_DN, VanChuyen::TTCOD_KT])->default(VanChuyen::TTCOD_KT);
            $table->integer('tien_cod')->default(0);
            $table->string('anh_xac_thuc')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('van_chuyens');
    }
};
