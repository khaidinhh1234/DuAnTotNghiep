<?php

use App\Models\DonHang;
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
        Schema::table('don_hangs', function (Blueprint $table) {
            $table->enum('trang_thai_don_hang', [DonHang::TTDH_CXH, DonHang::TTDH_DXH, DonHang::TTDH_DXL, DonHang::TTDH_DGH, DonHang::TTDH_CKHCN, DonHang::TTDH_HTDH, DonHang::TTDH_DHTB, DonHang::TTDH_DH, DonHang::TTDH_HH, DonHang::TTDH_CXNHH, DonHang::TTDH_TCHH])->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('don_hangs', function (Blueprint $table) {
            $table->enum('trang_thai_don_hang', [DonHang::TTDH_CXH, DonHang::TTDH_DXH, DonHang::TTDH_DXL, DonHang::TTDH_DGH, DonHang::TTDH_CKHCN, DonHang::TTDH_HTDH, DonHang::TTDH_DHTB, DonHang::TTDH_DH, DonHang::TTDH_HH, DonHang::TTDH_CXNHH])->nullable()->change();
        });
    }
};
