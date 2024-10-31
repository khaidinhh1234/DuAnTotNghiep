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
            $table->enum('trang_thai_don_hang', [DonHang::TTDH_CXH, DonHang::TTDH_DXH, DonHang::TTDH_DXL, DonHang::TTDH_DGH, DonHang::TTDH_CKHCN, DonHang::TTDH_HTDH, DonHang::TTDH_DHTB, DonHang::TTDH_DH, DonHang::TTDH_HH,DonHang::TTDH_CXNHH, ])->nullable();
            $table->enum('phuong_thuc_thanh_toan', [DonHang::PTTT_TT, DonHang::PTTT_MM_ATM, DonHang::PTTT_MM_QR])->nullable();
            $table->integer('tong_tien_don_hang')->nullable();
            $table->string('ten_nguoi_dat_hang')->nullable();
            $table->string('so_dien_thoai_nguoi_dat_hang')->nullable();
            $table->string('dia_chi_nguoi_dat_hang')->nullable();
            $table->string('ma_giam_gia')->nullable();
            $table->integer('so_tien_giam_gia')->nullable();
            $table->enum('trang_thai_thanh_toan', [DonHang::TTTT_CTT, DonHang::TTTT_DTT,DonHang::TTTT_DHT])->nullable();
            $table->string('duong_dan')->nullable();
            $table->dateTime('ngay_hoan_thanh_don')->nullable();
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
