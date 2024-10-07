<?php

namespace App\Traits;

use App\Models\LichSuHoatDong;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;

trait AuditTrait
{
    public static function bootAuditTrait()
    {
        static::created(function ($model) {
            self::logAction('create', $model);
        });

        static::updating(function ($model) {
            self::logAction('update', $model, json_encode($model->getOriginal()));
        });

        static::deleted(function ($model) {
            self::logAction('delete', $model, $model->toJson());
        });

        if (in_array(SoftDeletes::class, class_uses(get_called_class()))) {
            static::restored(function ($model) {
                self::logAction('restore', $model);
            });
        }
    }

    private static function logAction($actionType, $model, $oldData = null)
    {
        try {
            $userId = Auth::guard('api')->id();
            if (!$userId) {
                Log::warning("Không có ID người dùng để thực hiện thao tác $actionType.");
                return;
            }

            $user = User::find($userId);
            if (!$user) {
                Log::warning("Người dùng với ID $userId không tồn tại.");
                return;
            }

            LichSuHoatDong::create([
                'ten_bang' => $model->getTable(),
                'bang_id' => $model->id,
                'loai_thao_tac' => $actionType,
                'du_lieu_cu' => $oldData,
                'du_lieu_moi' => $model->toJson(),
                'nguoi_thao_tac' => $user->id,
            ]);

            Log::debug("Người thao tác: $user->id, loại thao tác: $actionType");

        } catch (\Exception $e) {
            Log::error('Lỗi khi ghi log hoạt động: ' . $e->getMessage());
        }
    }
}
