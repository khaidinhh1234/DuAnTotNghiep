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
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Thêm mới',
                    'du_lieu_moi' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id,
                    'dia_chi_ip' => request()->ip(),
                    'mo_ta' => 'Thêm mới bản ghi trong bảng ' . $model->getTable(),
                ]);
            }
        });

        static::updating(function ($model) {
            $user = Auth::user();
            if ($user) {
                $thay_doi = array_diff_assoc($model->getAttributes(), $model->getOriginal());
                $mo_ta = [];

                foreach ($thay_doi as $key => $newValue) {
                    $oldValue = $model->getOriginal($key);
                    $tenTruong = self::getFieldNameInVietnamese($key);
                    $mo_ta[] = "$tenTruong: <$oldValue> thành <$newValue>";
                }

                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Cập nhật',
                    'du_lieu_cu' => $model->getOriginal(),
                    'du_lieu_moi' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id,
                    'dia_chi_ip' => request()->ip(),
                    'mo_ta' => implode(', ', $mo_ta),
                ]);
            }
        });

        static::deleted(function ($model) {
            $user = Auth::user();
            if ($user) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Xóa',
                    'du_lieu_cu' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id,
                    'dia_chi_ip' => request()->ip(),
                    'mo_ta' => 'Xóa bản ghi khỏi bảng ' . $model->getTable() . ': ' . json_encode($model->getAttributes()),
                ]);
            }
        });

        if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses(static::class))) {
            static::restored(function ($model) {
                $user = Auth::user();
                if ($user) {
                    LichSuHoatDong::create([
                        'ten_bang' => $model->getTable(),
                        'bang_id' => $model->id,
                        'loai_thao_tac' => 'Khôi phục',
                        'du_lieu_moi' => $model->getAttributes(),
                        'nguoi_thao_tac' => $user->id,
                        'dia_chi_ip' => request()->ip(),
                        'mo_ta' => 'Khôi phục bản ghi trong bảng ' . $model->getTable(),
                    ]);
                }
            });
        }
    }

    private static function getFieldNameInVietnamese($key)
    {
        $fields = [
            'ten_bang' => 'Tên bảng',
            'bang_id' => 'ID bảng',
            'loai_thao_tac' => 'Loại thao tác',
            'du_lieu_cu' => 'Dữ liệu cũ',
            'du_lieu_moi' => 'Dữ liệu mới',
            'nguoi_thao_tac' => 'Người thao tác',
            'dia_chi_ip' => 'Địa chỉ IP',
            'mo_ta' => 'Mô tả',
            'ten_danh_muc' => 'Tên danh mục',
            'mo_ta_danh_muc' => 'Mô tả danh mục',
            'created_at' => 'Ngày tạo',
            'updated_at' => 'Ngày cập nhật',
        ];

        return $fields[$key] ?? $key;
    }
}
