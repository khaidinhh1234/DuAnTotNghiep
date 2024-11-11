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
        Schema::table('hoan_hangs', function (Blueprint $table) {
            $table->foreignIdFor(HoanTien::class)->constrained()->after('id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hoan_hangs', function (Blueprint $table) {
            $table->dropForeign(['hoan_tien_id']);
            $table->dropColumn('hoan_tien_id');
        });
    }
};
