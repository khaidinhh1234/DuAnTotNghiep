<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('van_chuyens', function (Blueprint $table) {
            $table->enum('trang_thai_van_chuyen', [
                'chờ xử lý',
                'đang giao hàng',
                'giao hàng thành công',
                'giao hàng thất bại',
                'nhận hàng hoàn'
            ])->default('chờ xử lý')->change();
        });
    }

    public function down()
    {
        Schema::table('van_chuyens', function (Blueprint $table) {
            $table->enum('trang_thai_van_chuyen', [
                'chờ xử lý',
                'đang giao hàng',
                'giao hàng thành công',
                'giao hàng thất bại'
            ])->default('chờ xử lý')->change();
        });
    }
};