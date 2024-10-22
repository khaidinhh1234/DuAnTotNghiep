<?php

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
        Schema::create('thong_baos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained();
            $table->string('tieu_de');
            $table->string('noi_dung');
            $table->string('loai');
            $table->string('duong_dan')->nullable();
            $table->string('loai_duong_dan')->nullable();
            $table->string('id_duong_dan')->nullable();
            $table->string('da_doc')->default(0);
            $table->string('trang_thai_da_doc')->default(0);
            $table->string('hinh_thu_nho')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thong_baos');
    }
};
