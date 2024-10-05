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

        // Lấy tất cả các chương trình ưu đãi còn hiệu lực
        $uuDais = ChuongTrinhUuDai::where('ngay_bat_dau', '<=', $ngayHienTai)
            ->where('ngay_ket_thuc', '>=', $ngayHienTai)
            ->get();

        // Duyệt qua từng chương trình ưu đãi
        foreach ($uuDais as $uuDai) {
            Log::info('Cập nhật giá khuyến mãi tạm thời cho chương trình ưu đãi ID: ' . $uuDai->id);

            // Lấy danh sách sản phẩm liên kết với chương trình ưu đãi
            $sanPhams = SanPham::whereHas('chuongTrinhUuDais', function ($query) use ($uuDai) {
                $query->where('chuong_trinh_uu_dai_id', $uuDai->id);
            })->with('bienTheSanPham')->get();

            Log::info('Số sản phẩm liên kết với chương trình ưu đãi ID: ' . $uuDai->id . ' là: ' . $sanPhams->count());

            // Duyệt qua từng sản phẩm
            foreach ($sanPhams as $sanPham) {
                Log::info('Xử lý sản phẩm ID: ' . $sanPham->id);
                $bienTheSanPhams = $sanPham->bienTheSanPham;

                // Kiểm tra xem sản phẩm có biến thể không
                if ($bienTheSanPhams->isEmpty()) {
                    Log::warning('Sản phẩm ID: ' . $sanPham->id . ' không có biến thể.');
                    continue;
                }

                foreach ($bienTheSanPhams as $bienTheSanPham) {
                    $originalPrice = $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;

                    // Kiểm tra nếu biến thể không có giá trị ban đầu
                    if ($originalPrice === null) {
                        Log::warning('Biến thể không có giá: ID ' . $bienTheSanPham->id);
                        continue;
                    }

                    // Tính giá khuyến mãi tạm thời dựa trên loại ưu đãi
                    if ($uuDai->loai == 'tien') {
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $originalPrice - $uuDai->gia_tri_uu_dai);
                    } elseif ($uuDai->loai == 'phan_tram') {
                        $discountAmount = ($originalPrice * $uuDai->gia_tri_uu_dai) / 100;
                        $bienTheSanPham->gia_khuyen_mai_tam_thoi = max(0, $originalPrice - $discountAmount);
                    }

                    Log::info('Cập nhật giá khuyến mãi tạm thời cho biến thể ID: ' . $bienTheSanPham->id . ', Giá khuyến mãi tạm thời: ' . $bienTheSanPham->gia_khuyen_mai_tam_thoi);

                    // Sử dụng try-catch để lưu biến thể sản phẩm an toàn
                    try {
                        $bienTheSanPham->save();
                        Log::info('Lưu thành công biến thể ID: ' . $bienTheSanPham->id);
                    } catch (\Exception $e) {
                        Log::error('Lỗi khi lưu biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                    }
                }
            }
        }

        return 0; // Trả về mã thành công
    }
}
