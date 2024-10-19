<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CapNhatGiaKhuyenMaiTamThoi extends Command
{
    protected $signature = 'khuyenmai:update-gia-tam-thoi';

    protected $description = 'Cập nhật giá khuyến mãi tạm thời cho các sản phẩm thuộc các chương trình ưu đãi còn hiệu lực';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $ngayHienTai = Carbon::now();

        $uuDais = ChuongTrinhUuDai::where('ngay_bat_dau', '<=', $ngayHienTai)
            ->where('ngay_ket_thuc', '>=', $ngayHienTai)
            ->get();

        foreach ($uuDais as $uuDai) {
            Log::info('Cập nhật giá khuyến mãi tạm thời cho chương trình ưu đãi ID: ' . $uuDai->id);

            $sanPhams = SanPham::whereHas('chuongTrinhUuDais', function ($query) use ($uuDai) {
                $query->where('chuong_trinh_uu_dai_id', $uuDai->id);
            })->with('bienTheSanPham')->get();

            Log::info('Số sản phẩm liên kết với chương trình ưu đãi ID: ' . $uuDai->id . ' là: ' . $sanPhams->count());

            foreach ($sanPhams as $sanPham) {
                Log::info('Xử lý sản phẩm ID: ' . $sanPham->id);
                $bienTheSanPhams = $sanPham->bienTheSanPham;

                if ($bienTheSanPhams->isEmpty()) {
                    Log::warning('Sản phẩm ID: ' . $sanPham->id . ' không có biến thể.');
                    continue;
                }

                foreach ($bienTheSanPhams as $bienTheSanPham) {
                    $originalPrice = $bienTheSanPham->gia_ban;

                    if ($originalPrice === null) {
                        Log::warning('Biến thể không có giá: ID ' . $bienTheSanPham->id);
                        continue;
                    }

                    if ($uuDai->loai == 'tien') {
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $originalPrice - $uuDai->gia_tri_uu_dai);
                    } elseif ($uuDai->loai == 'phan_tram') {
                        $discountAmount = ($originalPrice * $uuDai->gia_tri_uu_dai) / 100;
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $originalPrice - $discountAmount);
                    }

                    Log::info('Cập nhật giá khuyến mãi tạm thời cho biến thể ID: ' . $bienTheSanPham->id . ', Giá khuyến mãi tạm thời: ' . $bienTheSanPham->gia_khuyen_mai_tam_thoi);

                    try {
                        $bienTheSanPham->save();
                        Log::info('Lưu thành công biến thể ID: ' . $bienTheSanPham->id);
                    } catch (\Exception $e) {
                        Log::error('Lỗi khi lưu biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                    }
                }
            }
        }

        return 0;
    }
}
