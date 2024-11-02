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
        Schema::create('momo', function (Blueprint $table) {
            $table->id();
            $table->string('partnerCode', 255)->comment('Mã đối tác');
            $table->string('orderId', 255)->unique()->comment('ID đơn hàng');
            $table->string('requestId')->comment('ID yêu cầu');
            $table->string('amount')->comment('Số tiền thanh toán');
            $table->string('transId')->unique()->comment('ID giao dịch');
            $table->string('orderInfo', 255)->comment('Thông tin đơn hàng');
            $table->string('orderType', 255)->comment('Loại đơn hàng');
            $table->string('payType', 255)->comment('Loại thanh toán');
            $table->string('signature', 255)->comment('Chữ ký bảo mật');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('momo');
    }
};
