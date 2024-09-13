<?php

use App\Models\User;
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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('ho', 30);
            $table->string('ten', 30);
            $table->string('anh_nguoi_dung')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('so_dien_thoai', 15)->nullable();
            $table->string('dia_chi', 100)->nullable();
            $table->date('ngay_sinh')->nullable();
            $table->enum('gioi_tinh', [User::TYPE_NAM, User::TYPE_NU, User::TYPE_KHAC])->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
