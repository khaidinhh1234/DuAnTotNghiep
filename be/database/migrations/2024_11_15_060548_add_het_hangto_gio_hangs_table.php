<?php

use App\Models\HoanTien;
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
        Schema::table('gio_hangs', function (Blueprint $table) {
            $table->boolean('het_hang')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gio_hangs', function (Blueprint $table) {
            $table->dropColumn(['het_hang']);
        });
    }
};