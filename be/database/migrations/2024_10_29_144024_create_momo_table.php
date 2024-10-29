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
            $table->string('partnerCode',50)->comment('Mã đối tác');
            $table->string('orderId',50)->unique()->comment('ID đơn hàng');
            $table->string('requestId',50)->comment('ID yêu cầu');
            $table->string('amount',50)->comment('Số tiền thanh toán');
            $table->string('orderInfo',50)->comment('Thông tin đơn hàng');
            $table->string('orderType',50)->comment('Loại đơn hàng');
            $table->string('transId',50)->unique()->comment('ID giao dịch');
            $table->string('payType',50)->comment('Loại thanh toán');
            $table->string('signature',50)->comment('Chữ ký bảo mật');
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
