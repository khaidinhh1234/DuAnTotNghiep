<?php

namespace App\Observers;

use App\Models\ChuongTrinhUuDai;
use App\Models\SanPham;
use App\Models\BienTheSanPham;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChuongTrinhUuDaiObserver
{

    public function deleting(ChuongTrinhUuDai $uuDai)
    {
        $ngayHienTai = Carbon::now();
        Log::info('Xóa chương trình ưu đãi ID: ' . $uuDai->id . ' vào lúc: ' . $ngayHienTai);

        if ($uuDai->ngay_ket_thuc < $ngayHienTai) {
            $sanPhams = $uuDai->sanPhams()->get();
            Log::info('Số sản phẩm liên kết với chương trình ưu đãi ID: ' . $uuDai->id . ' là: ' . $sanPhams->count());

            foreach ($sanPhams as $sanPham) {
                Log::info('Xử lý sản phẩm ID: ' . $sanPham->id);
                $bienTheSanPhams = $sanPham->bienTheSanPham()
                    ->whereNotNull('gia_khuyen_mai_tam_thoi')
                    ->get();

                foreach ($bienTheSanPhams as $bienTheSanPham) {
                    Log::info('Đặt lại giá khuyến mãi tạm thời cho biến thể ID: ' . $bienTheSanPham->id);
                    $bienTheSanPham->gia_khuyen_mai_tam_thoi = null;

                    try {
                        $bienTheSanPham->save();
                        Log::info('Lưu thành công biến thể ID: ' . $bienTheSanPham->id . ' với giá khuyến mãi tạm thời đã được đặt lại.');
                    } catch (\Exception $e) {
                        Log::error('Lỗi khi lưu lại biến thể ID: ' . $bienTheSanPham->id . ' - ' . $e->getMessage());
                    }
                }
            }
        } else {
            Log::info('Chương trình ưu đãi ID: ' . $uuDai->id . ' vẫn còn hiệu lực, không thực hiện xóa.');
        }
    }
}
