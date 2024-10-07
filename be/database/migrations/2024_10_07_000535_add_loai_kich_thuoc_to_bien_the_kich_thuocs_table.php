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
        Schema::table('bien_the_kich_thuocs', function (Blueprint $table) {
            $table->enum('loai_kich_thuoc', ['nam', 'nu', 'tre_em'])->after('kich_thuoc');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bien_the_kich_thuocs', function (Blueprint $table) {
            $table->dropColumn('loai_kich_thuoc');
        });
    }
};
