<?php

use App\Models\ViTien;
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
        Schema::create('giao_dich_vis', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ViTien::class)->constrained()->onDelete('cascade');
            $table->string('ma_giao_dich')->unique();
            $table->enum('loai_giao_dich', ['hoan_tien', 'rut_tien', 'thanh_toan']);
            $table->integer('so_tien');
            $table->text('mo_ta');
            $table->enum('trang_thai', ['dang_xu_ly', 'thanh_cong', 'that_bai'])->default('dang_xu_ly');
            $table->dateTime('thoi_gian_giao_dich');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giao_dich_vis');
    }
};
