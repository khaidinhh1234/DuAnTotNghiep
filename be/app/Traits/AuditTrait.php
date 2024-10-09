<?php

namespace App\Traits;

use App\Models\LichSuHoatDong;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait AuditTrait
{
    public static function bootAuditTrait()
    {
        static::created(function ($model) {
            $user = Auth::guard('api');
            if ($user->check()) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Thêm mới',
                    'du_lieu_moi' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id(),
                ]);
            }
        });

        static::updating(function ($model) {
            $user = Auth::guard('api');
            if ($user->check()) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Cập nhật',
                    'du_lieu_cu' => $model->getOriginal(),
                    'du_lieu_moi' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id(),
                ]);
            }
        });

        static::deleted(function ($model) {
            $user = Auth::guard('api');
            if ($user->check()) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'Xóa',
                    'du_lieu_cu' => $model->getAttributes(),
                    'nguoi_thao_tac' => $user->id(),
                ]);
            }
        });

        if (in_array(SoftDeletes::class, class_uses(static::class))) {
            static::restored(function ($model) {
                $user = Auth::guard('api');
                if ($user->check()) {
                    LichSuHoatDong::create([
                        'ten_bang' => $model->getTable(),
                        'bang_id' => $model->id,
                        'loai_thao_tac' => 'Khôi phục',
                        'du_lieu_moi' => $model->getAttributes(),
                        'nguoi_thao_tac' => $user->id(),
                    ]);
                }
            });
        }
    }
}
