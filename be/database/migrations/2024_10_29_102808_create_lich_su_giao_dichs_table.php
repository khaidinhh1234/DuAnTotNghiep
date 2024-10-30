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
        Schema::create('lich_su_giao_dichs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ViTien::class)->constrained();
            $table->integer('so_du_truoc');
            $table->integer('so_du_sau');
            $table->dateTime('ngay_thay_doi');
            $table->string('mo_ta', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lich_su_giao_dichs');
    }
};
