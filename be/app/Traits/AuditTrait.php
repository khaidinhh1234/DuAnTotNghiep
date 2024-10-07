<?php

namespace App\Traits;

use App\Models\LichSuHoatDong;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;

trait AuditTrait
{
    public static function bootAuditTrait()
    {
        static::created(function ($model) {
            $user = Auth::guard('api')->user();
            if ($user) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'create',
                    'du_lieu_moi' => $model->toJson(),
                    'nguoi_thao_tac' => $user->id,
                ]);
            } else {
                Log::warning('Không có người dùng đăng nhập để lưu lịch sử create.');
            }
        });

        static::updating(function ($model) {
            $user = Auth::guard('api')->user();
            if ($user) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'update',
                    'du_lieu_cu' => json_encode($model->getOriginal()),
                    'du_lieu_moi' => $model->toJson(),
                    'nguoi_thao_tac' => $user->id,
                ]);
            } else {
                Log::warning('Không có người dùng đăng nhập để lưu lịch sử update.');
            }
        });

        static::deleted(function ($model) {
            $user = Auth::guard('api')->user();
            if ($user) {
                LichSuHoatDong::create([
                    'ten_bang' => $model->getTable(),
                    'bang_id' => $model->id,
                    'loai_thao_tac' => 'delete',
                    'du_lieu_cu' => $model->toJson(),
                    'nguoi_thao_tac' => $user->id,
                ]);
            } else {
                Log::warning('Không có người dùng đăng nhập để lưu lịch sử delete.');
            }
        });

        if (in_array(SoftDeletes::class, class_uses(static::class))) {
            static::restored(function ($model) {
                $user = Auth::guard('api')->user();
                if ($user) {
                    LichSuHoatDong::create([
                        'ten_bang' => $model->getTable(),
                        'bang_id' => $model->id,
                        'loai_thao_tac' => 'restore',
                        'du_lieu_moi' => $model->toJson(),
                        'nguoi_thao_tac' => $user->id,
                    ]);
                } else {
                    Log::warning('Không có người dùng đăng nhập để lưu lịch sử restore.');
                }
            });
        }
    }
}
