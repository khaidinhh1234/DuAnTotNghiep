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
                'Chờ xử lý',
                'Đang giao hàng',
                'Giao hàng thành công',
                'Giao hàng thất bại',
                'Nhận hàng hoàn'
            ])->default('Chờ xử lý')->change();
        });
    }

    public function down()
    {
        Schema::table('van_chuyens', function (Blueprint $table) {
            $table->enum('trang_thai_van_chuyen', [
                'Chờ xử lý',
                'Đang giao hàng',
                'Giao hàng thành công',
                'Giao hàng thất bại',
                'Nhận hàng hoàn'
            ])->default('Chờ xử lý')->change();
        });
    }
};
