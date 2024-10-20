<?php

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
            $table->dropColumn(['gia', 'gia_cu']);
            $table->boolean('chon')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gio_hangs', function (Blueprint $table) {
            $table->dropColumn('chon');
            $table->integer('gia');
            $table->integer('gia_cu');
        });
    }
};
