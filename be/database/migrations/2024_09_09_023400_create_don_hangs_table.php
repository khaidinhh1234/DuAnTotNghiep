<?php

use App\Models\DonHang;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('don_hangs', function (Blueprint $table) {
            $table->id();
            $table->string('ma_don_hang')->unique();  // Thêm cột ma_don_hang và đảm bảo giá trị là unique
            $table->foreignIdFor(User::class)->constrained();
            $table->text('ghi_chu')->nullable();
            $table->enum('trang_thai_don_hang', [DonHang::TTDH_CXH, DonHang::TTDH_DXH, DonHang::TTDH_DXL, DonHang::TTDH_DGH, DonHang::TTDH_DGTC, DonHang::TTDH_DH])->nullable();
            $table->enum('phuong_thuc_thanh_toan', [DonHang::PTTT_TT, DonHang::PTTT_NH, DonHang::PTTT_MM])->nullable();
            $table->decimal('tong_tien_don_hang', 15, 2)->nullable();
            $table->string('ten_nguoi_dat_hang');
            $table->string('so_dien_thoai_nguoi_dat_hang');
            $table->string('dia_chi_nguoi_dat_hang');
            $table->string('ma_giam_gia')->nullable();
            $table->decimal('so_tien_giam_gia', 15, 2)->nullable();
            $table->enum('trang_thai_thanh_toan', [
                'chua_thanh_toan',  // chưa thanh toán
                'da_thanh_toan',    // đã thanh toán
                'dang_xu_ly',       // đang xử lý
                'da_huy'            // đã hủy
            ])->nullable();
            $table->string('duong_dan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hangs');
    }
};
