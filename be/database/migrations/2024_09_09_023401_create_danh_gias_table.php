<?php


use App\Models\DonHang;
use App\Models\SanPham;
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
        Schema::create('danh_gias', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(SanPham::class)->constrained();
            $table->foreignIdFor(DonHang::class)->constrained();
            $table->integer('so_sao_san_pham')->nullable();
            $table->integer('so_sao_dich_vu_van_chuyen')->nullable();
            $table->text('chat_luong_san_pham')->nullable();
            $table->text('mo_ta')->nullable();
            $table->text('phan_hoi')->nullable();
            $table->integer('huu_ich')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gias');
    }
};
