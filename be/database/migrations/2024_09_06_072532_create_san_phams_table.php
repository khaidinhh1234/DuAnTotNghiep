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
            $table->string('mo_ta_ngan')->nullable();
            $table->text('noi_dung')->nullable();
            $table->integer('luot_xem')->default(0);
            $table->boolean('trang_thai')->default(1);
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
