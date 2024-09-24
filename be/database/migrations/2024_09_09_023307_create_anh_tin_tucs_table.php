<?php

use App\Models\TinTuc;
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
        Schema::create('anh_tin_tucs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(TinTuc::class)->constrained();
            $table->string('anh_tin_tuc')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anh_tin_tucs');
    }
};
