<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BienTheSanPham;
use Carbon\Carbon;

class UpdateProductVariantsPrice extends Command
{
    protected $signature = 'update:product-variants-price';
    protected $description = 'Cập nhật giá khuyến mãi về giá gốc nếu đã hết hạn khuyến mãi';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();

        $productsToUpdate = BienTheSanPham::whereNotNull('gia_khuyen_mai')
            ->where('ngay_ket_thuc_khuyen_mai', '<', $now)
            ->get();

        foreach ($productsToUpdate as $product) {
            $product->gia_khuyen_mai = null;
            $product->save();
            $this->info("Đã cập nhật biến thể sản phẩm ID: " . $product->id);
        }

        $this->info('Cập nhật giá khuyến mãi hoàn tất.');
    }
}
