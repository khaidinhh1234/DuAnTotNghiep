<?php

use App\Models\DonHang;
use App\Models\Hoan_hang;
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
        Schema::create('hoan_hangs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(DonHang::class)->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('shipper_id')->constrained('users')->cascadeOnDelete();
            $table->string('ma_hoan_hang')->unique();
            $table->date('ngay_tao');
            $table->enum('trang_thai_hoan_hang', [Hoan_hang::TTHH_CLHH, Hoan_hang::TTHH_DVC, Hoan_hang::TTHH_THTC])->default(Hoan_hang::TTHH_CLHH);
            $table->dateTime('ngay_lay_hang')->nullable();
            $table->dateTime('ngay_hoan_hang_thanh_cong')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hoan_hangs');
    }
};
