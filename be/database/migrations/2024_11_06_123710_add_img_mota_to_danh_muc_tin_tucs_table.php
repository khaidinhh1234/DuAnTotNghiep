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
        Schema::table('danh_muc_tin_tucs', function (Blueprint $table) {
            $table->text('mo_ta')->nullable();
            $table->string('hinh_anh')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('danh_muc_tin_tucs', function (Blueprint $table) {
            $table->dropColumn('mo_ta');
            $table->dropColumn('hinh_anh');
        });
    }
};
