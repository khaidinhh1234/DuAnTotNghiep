<?php

namespace App\Console\Commands;

use App\Events\ThongBaoMoi;
use App\Models\ThongBao;
use Illuminate\Console\Command;
use App\Models\User;
use App\Models\DonHang;
use App\Models\HangThanhVien;
use Carbon\Carbon;

class UpdateMemberRankCommand extends Command
{
    protected $signature = 'member:update-rank';
    protected $description = 'Cập nhật hạng thành viên dựa trên tổng chi tiêu đơn hàng hoàn thành, và thông báo sắp lên/xuống hạng nếu cần';

    public function handle()
    {
        $users = User::with('donHangs')->get();

        foreach ($users as $user) {
            // Tính tổng chi tiêu của người dùng
            $tongChiTieu = $user->donHangs()
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->sum('tong_tien_don_hang');

            echo "{$user->id}: {$tongChiTieu}\n";

            $hangThanhVienMoi = HangThanhVien::where('chi_tieu_toi_thieu', '<=', $tongChiTieu)
                ->where('chi_tieu_toi_da', '>=', $tongChiTieu)
                ->first();

            if ($hangThanhVienMoi && $user->hang_thanh_vien_id != $hangThanhVienMoi->id) {
                $this->info("Hạng của User ID {$user->id} đã được cập nhật thành: {$hangThanhVienMoi->ten_hang_thanh_vien}");

                $user->update([
                    'hang_thanh_vien_id' => $hangThanhVienMoi->id
                ]);

                $thongBao = ThongBao::create([
                    'user_id' => $user->id,
                    'tieu_de' => 'Chúc mừng lên hạng!',
                    'noi_dung' => "Chúc mừng bạn đã lên hạng {$hangThanhVienMoi->ten_hang_thanh_vien}. Tiếp tục mua sắm để nhận thêm nhiều ưu đãi hấp dẫn!",
                    'loai' => 'Hạng thành viên',
                    'hinh_thu_nho' => $hangThanhVienMoi->anh_hang_thanh_vien,
                ]);

                broadcast(new ThongBaoMoi($thongBao))->toOthers();
            }

            $donHangCuoi = $user->donHangs()
                ->where('trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->latest('ngay_hoan_thanh_don')
                ->first();

            if ($donHangCuoi && Carbon::parse($donHangCuoi->ngay_hoan_thanh_don)->diffInMonths(Carbon::now()) >= 3) {
                $thongBao = ThongBao::create([
                    'user_id' => $user->id,
                    'tieu_de' => 'Cảnh báo sắp xuống hạng!',
                    'noi_dung' => 'Đã 3 tháng bạn chưa mua hàng, hạng của bạn có thể bị giảm nếu không tiếp tục mua sắm.',
                    'loai' => 'Hạng thành viên',
                    'hinh_thu_nho' => 'https://img.lovepik.com/free-png/20220118/lovepik-gold-medal-icon-png-image_401479038_wh860.png',
                ]);

                broadcast(new ThongBaoMoi($thongBao))->toOthers();
            }

            $hangTiepTheo = HangThanhVien::where('chi_tieu_toi_thieu', '>', $tongChiTieu)
                ->orderBy('chi_tieu_toi_thieu', 'asc')
                ->first();

            if ($hangTiepTheo && $tongChiTieu >= ($hangTiepTheo->chi_tieu_toi_thieu * 0.9)) {
                $thongBao = ThongBao::create([
                    'user_id' => $user->id,
                    'tieu_de' => 'Gần lên hạng mới!',
                    'noi_dung' => "Chỉ còn một chút nữa là bạn sẽ đạt hạng {$hangTiepTheo->ten_hang_thanh_vien}. Hãy tiếp tục mua sắm để chinh phục hạng mới!",
                    'loai' => 'Hạng thành viên',
                    'hinh_thu_nho' => 'https://img.lovepik.com/free-png/20220118/lovepik-gold-medal-icon-png-image_401479038_wh860.png',
                ]);

                broadcast(new ThongBaoMoi($thongBao))->toOthers();
            }
        }

        $this->info('Đã hoàn thành cập nhật hạng và gửi thông báo.');
    }
}
