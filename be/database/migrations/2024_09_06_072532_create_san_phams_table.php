<?php

use App\Models\DanhMuc;
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
        Schema::create('san_phams', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(DanhMuc::class)->nullable()->constrained()->onDelete('set null');
            $table->string('ten_san_pham')->unique();
            $table->string('anh_san_pham')->nullable();
            $table->string('ma_san_pham')->unique();
            $table->string('duong_dan');
            $table->integer('gia_ban');
            $table->integer('gia_khuyen_mai')->nullable();
            $table->dateTime('ngay_bat_dau_khuyen_mai')->nullable(); // Ngày bắt đầu khuyến mãi
            $table->dateTime('ngay_ket_thuc_khuyen_mai')->nullable(); // Ngày kết thúc khuyến mãi
            $table->string('mo_ta_ngan')->nullable();
            $table->text('noi_dung')->nullable();
            $table->string('gia_tri_uu_dai')->nullable();
            $table->integer('luot_xem')->default(0);
            $table->boolean('trang_thai')->default(1);
            $table->boolean('giam_gia_soc')->default(0);
            $table->boolean('hang_moi')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('san_phams');
    }
};
