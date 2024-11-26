<?php

namespace App\Traits;

use App\Models\LichSuHoatDong;
use Illuminate\Support\Facades\Auth;

trait AuditTrait
{
    public static function bootAuditTrait()
    {
        static::created(function ($model) {
            $user = Auth::user();
            if ($user) {
                $tenBang = self::getFieldNameInVietnamese($model->getTable());

                LichSuHoatDong::create([
                    'ten_bang' => $tenBang,
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Thêm mới',
                    'du_lieu_moi' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id,
                    'dia_chi_ip' => request()->ip(),
                    'mo_ta' => 'Thêm mới bản ghi trong bảng < ' . $tenBang . ' >',
                ]);
            }
        });

        static::updating(function ($model) {
            $user = Auth::user();
            if ($user) {
                $thay_doi = array_diff_assoc($model->getAttributes(), $model->getOriginal());
                $mo_ta = [];
                $tenBang = self::getFieldNameInVietnamese($model->getTable());

                foreach ($thay_doi as $key => $newValue) {
                    $oldValue = $model->getOriginal($key);
                    $tenTruong = self::getFieldNameInVietnamese($key);
                    $mo_ta[] = "$tenTruong: <$oldValue> thành <$newValue>";
                }

                LichSuHoatDong::create([
                    'ten_bang' => $tenBang,
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Cập nhật',
                    'du_lieu_cu' => $model->getOriginal(),
                    'du_lieu_moi' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id,
                    'dia_chi_ip' => request()->ip(),
                    'mo_ta' => 'Cập nhật bản ghi trong bảng < ' . $tenBang . ' > : ' . implode(', ', $mo_ta),
                ]);
            }
        });

        static::deleted(function ($model) {
            $user = Auth::user();
            if ($user) {
                $tenBang = self::getFieldNameInVietnamese($model->getTable());

                LichSuHoatDong::create([
                    'ten_bang' => $tenBang,
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Xóa',
                    'du_lieu_cu' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id,
                    'dia_chi_ip' => request()->ip(),
                    'mo_ta' => 'Xóa bản ghi ' . $model->id . ' khỏi bảng < ' . $tenBang . ' >',
                ]);
            }
        });

        if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses(static::class))) {
            static::restored(function ($model) {
                $user = Auth::user();
                if ($user) {
                    $tenBang = self::getFieldNameInVietnamese($model->getTable());

                    LichSuHoatDong::create([
                        'ten_bang' => $tenBang,
                        'bang_id' => $model->id,
                        'loai_thao_tac' => 'Khôi phục',
                        'du_lieu_moi' => $model->getAttributes(),
                        'nguoi_thao_tac' => $user->id,
                        'dia_chi_ip' => request()->ip(),
                        'mo_ta' => 'Khôi phục bản ghi ' . $model->id . ' trong bảng < ' . $tenBang . ' >',
                    ]);
                }
            });
        }
    }

    private static function getFieldNameInVietnamese($key)
    {
        $fields = [
            'anh_bien_thes' => 'Ảnh biến thể',
            'bien_the_san_pham_id' => 'ID biến thể sản phẩm',

            'anh_danh_gias' => 'Ảnh đánh giá',
            'danh_gia_id' => 'ID đánh giá',
            'anh_danh_gia' => 'Ảnh đánh giá',

            'bien_the_kich_thuocs' => 'Biến thể kích thước',
            'kich_thuoc' => 'Kích thước',
            'loai_kich_thuoc' => 'Loại kích thước',

            'bien_the_mau_sacs' => 'Biến thể màu sắc',
            'ten_mau_sac' => 'Tên màu sắc',
            'ma_mau_sac' => 'Mã màu sắc',

            'bien_the_san_phams' => 'Biến thể sản phẩm',
            'san_pham_id' => 'ID sản phẩm',
            'bien_the_mau_sac_id' => 'ID biến thể màu sắc',
            'bien_the_kich_thuoc_id' => 'ID biến thể kích thước',
            'so_luong_bien_the' => 'Số lượng biến thể',
            'chi_phi_san_xuat' => 'Chi phí sản xuất',
            'gia_ban' => 'Giá bán',
            'gia_khuyen_mai' => 'Giá khuyến mãi',
            'gia_khuyen_mai_tam_thoi' => 'Giá khuyến mãi tạm thời',

            'bo_suu_taps' => 'Bộ sưu tập',
            'ten' => 'Tên',
            'duong_dan' => 'Đường dẫn',
            'duong_dan_anh' => 'Đường dẫn ảnh',

            'bo_suu_tap_san_pham' => 'Bộ sưu tập sản phẩm',
            'bo_suu_tap_id' => 'ID bộ sưu tập',

            'chuong_trinh_san_pham' => 'Chương trình sản phẩm',
            'chuong_trinh_uu_dai_id' => 'ID chương trình ưu đãi',

            'chuong_trinh_uu_dais' => 'Chương trình ưu đãi',
            'ten_uu_dai' => 'Tên ưu đãi',
            'ngay_hien_thi' => 'Ngày hiển thị',
            'ngay_bat_dau' => 'Ngày bắt đầu',
            'ngay_ket_thuc' => 'Ngày kết thúc',
            'gia_tri_uu_dai' => 'Giá trị ưu đãi',
            'loai' => 'Loại',

            'danh_gias' => 'Đánh giá',
            'user_id' => 'ID người dùng',
            'don_hang_id' => 'ID đơn hàng',
            'so_sao_san_pham' => 'Số sao sản phẩm',
            'so_sao_dich_vu_van_chuyen' => 'Số sao dịch vụ vận chuyển',
            'chat_luong_san_pham' => 'Chất lượng sản phẩm',
            'mo_ta' => 'Mô tả',
            'phan_hoi' => 'Phản hồi',
            'huu_ich' => 'Hữu ích',

            'danh_mucs' => 'Danh mục',
            'ten_danh_muc' => 'Tên danh mục',
            'cha_id' => 'ID cha',
            'anh_danh_muc' => 'Ảnh danh mục',

            'danh_muc_tin_tucs' => 'Danh mục tin tức',
            'ten_danh_muc_tin_tuc' => 'Tên danh mục tin tức',

            'don_hangs' => 'Đơn hàng',
            'ma_don_hang' => 'Mã đơn hàng',
            'trang_thai_don_hang' => 'Trạng thái đơn hàng',
            'phuong_thuc_thanh_toan' => 'Phương thức thanh toán',
            'tong_tien_don_hang' => 'Tổng tiền đơn hàng',
            'ten_nguoi_dat_hang' => 'Tên người đặt hàng',
            'so_dien_thoai_nguoi_dat_hang' => 'Số điện thoại người đặt hàng',
            'dia_chi_nguoi_dat_hang' => 'Địa chỉ người đặt hàng',
            'ma_giam_gia' => 'Mã giảm giá',
            'so_tien_giam_gia' => 'Số tiền giảm giá',
            'trang_thai_thanh_toan' => 'Trạng thái thanh toán',
            'ngay_hoan_thanh_don' => 'Ngày hoàn thành đơn',

            'don_hang_chi_tiets' => 'Chi tiết đơn hàng',
            'so_luong' => 'Số lượng',
            'gia' => 'Giá',
            'thanh_tien' => 'Thành tiền',

            'gio_hangs' => 'Giỏ hàng',

            'hang_thanh_viens' => 'Hạng thành viên',
            'ten_hang_thanh_vien' => 'Tên hạng thành viên',
            'anh_hang_thanh_vien' => 'Ảnh hạng thành viên',
            'chi_tieu_toi_thieu' => 'Chi tiêu tối thiểu',
            'chi_tieu_toi_da' => 'Chi tiêu tối đa',

            'ho_so_ho_tro' => 'Hồ sơ hỗ trợ',
            'phong_ho_tro_id' => 'ID phòng hỗ trợ',

            'lich_su_hoat_dongs' => 'Lịch sử hoạt động',
            'ten_bang' => 'Tên bảng',
            'bang_id' => 'ID bảng',
            'loai_thao_tac' => 'Loại thao tác',
            'du_lieu_cu' => 'Dữ liệu cũ',
            'du_lieu_moi' => 'Dữ liệu mới',
            'nguoi_thao_tac' => 'Người thao tác',
            'dia_chi_ip' => 'Địa chỉ IP',

            'id' => 'ID',
            'created_at' => 'Ngày tạo',
            'updated_at' => 'Ngày cập nhật',
            'deleted_at' => 'Ngày xóa',
        ];

        return $fields[$key] ?? $key;
    }
}