<?php

use App\Models\Quyen;
use App\Models\VaiTro;
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
        Schema::create('quyen_vai_tro', function (Blueprint $table) {
            $table->foreignIdFor(VaiTro::class)->constrained();
            $table->foreignIdFor(Quyen::class)->constrained();

            $table->primary(['vai_tro_id', 'quyen_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quyen_vai_tro');
    }
};
