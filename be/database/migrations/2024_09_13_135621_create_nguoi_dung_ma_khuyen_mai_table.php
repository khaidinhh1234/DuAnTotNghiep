<?php

use App\Models\MaKhuyenMai;
use App\Models\User;
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
        Schema::create('nguoi_dung_ma_khuyen_mai', function (Blueprint $table) {
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(MaKhuyenMai::class)->constrained();
            $table->boolean('da_su_dung')->default(false);
            $table->dateTime('ngay_su_dung')->nullable();
            $table->primary(['user_id', 'ma_khuyen_mai_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nguoi_dung_ma_khuyen_mai');
    }
};
