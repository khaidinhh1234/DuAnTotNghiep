<?php

use App\Models\DanhGia;
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
        Schema::create('danh_gia_huu_ich', function (Blueprint $table) {
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(DanhGia::class)->constrained();
            $table->primary(['user_id', 'danh_gia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('danh_gia_huu_ich');
    }
};
