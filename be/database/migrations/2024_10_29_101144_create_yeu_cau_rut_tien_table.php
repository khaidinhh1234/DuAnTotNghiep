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
        Schema::create('yeu_cau_rut_tiens', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ViTien::class)->constrained();
            $table->integer('so_tien');
            $table->string('taikhoan_ngan_hang', 100);
            $table->string('ten_chu_tai_khoan', 100);
            $table->string('ngan_hang', 100);
            $table->enum('phuong_thuc', ['ngan_hang', 'vi_dien_tu']);
            $table->enum('trang_thai', ['cho_duyet', 'da_rut', 'that_bai'])->default('cho_duyet');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('yeu_cau_rut_tiens');
    }
};
