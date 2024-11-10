<?php

namespace App\Traits;

use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\DanhMuc;
use App\Models\SanPham;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait LocSanPhamTrait
{
    public function locSanPham($sanPhamIds, Request $request)
    {
        DB::beginTransaction();

        try {
            $danhMucChaIds = $request->danh_muc_cha_ids ?? [];
            $danhMucConIds = $request->danh_muc_con_ids ?? [];
            $danhMucChauIds = $request->danh_muc_chau_ids ?? [];
            $mauSacIds = $request->mau_sac_ids ?? [];
            $kichThuocIds = $request->kich_thuoc_ids ?? [];
            $giaDuoi = $request->gia_duoi ?? null;
            $giaTren = $request->gia_tren ?? null;
            $productIds = is_array($sanPhamIds) ? $sanPhamIds : [];

            $query = SanPham::query()->where('trang_thai', 1);

            if (!empty($productIds)) {
                $query->whereIn('san_phams.id', $productIds);
            }

            if (!empty($danhMucChaIds) || !empty($danhMucConIds) || !empty($danhMucChauIds)) {
                $query->whereHas('danhMuc', function ($query) use ($danhMucChaIds, $danhMucConIds, $danhMucChauIds) {
                    $query->when(!empty($danhMucChaIds) && !empty($danhMucConIds) && !empty($danhMucChauIds), function ($query) use ($danhMucChaIds, $danhMucConIds, $danhMucChauIds) {
                        $query->where(function ($query) use ($danhMucChaIds, $danhMucConIds, $danhMucChauIds) {
                            $query->whereIn('cha_id', $danhMucChaIds)
                                ->whereIn('id', $danhMucConIds)
                                ->orWhereIn('id', $danhMucChauIds);
                        });
                    })
                        ->when(!empty($danhMucChaIds) && !empty($danhMucConIds), function ($query) use ($danhMucChaIds, $danhMucConIds) {
                            $query->where(function ($query) use ($danhMucChaIds, $danhMucConIds) {
                                $query->whereIn('cha_id', $danhMucChaIds)
                                    ->orWhereIn('id', $danhMucConIds);
                            });
                        })
                        ->when(!empty($danhMucChaIds), function ($query) use ($danhMucChaIds) {
                            $query->whereIn('cha_id', $danhMucChaIds)
                                ->orWhereIn('id', $danhMucChaIds);
                        })
                        ->when(!empty($danhMucConIds), function ($query) use ($danhMucConIds) {
                            $query->whereIn('id', $danhMucConIds)
                                ->orWhereIn('cha_id', $danhMucConIds);
                        })
                        ->when(!empty($danhMucChauIds), function ($query) use ($danhMucChauIds) {
                            $query->whereIn('id', $danhMucChauIds);
                        });
                });
            }

            if (!empty($mauSacIds) && is_array($mauSacIds)) {
                $query->whereHas('bienTheSanPham.mauBienThe', function ($query) use ($mauSacIds) {
                    $query->whereIn('id', $mauSacIds);
                });
            }

            if (!empty($kichThuocIds) && is_array($kichThuocIds)) {
                $query->whereHas('bienTheSanPham.kichThuocBienThe', function ($query) use ($kichThuocIds) {
                    $query->whereIn('id', $kichThuocIds);
                });
            }

            if (!is_null($giaDuoi) && !is_null($giaTren)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($giaDuoi, $giaTren) {
                    $query->where(function ($query) use ($giaDuoi, $giaTren) {
                        $query->whereBetween(DB::raw('COALESCE(gia_khuyen_mai_tam_thoi, gia_khuyen_mai, gia_ban)'), [$giaDuoi, $giaTren]);
                    });
                });
            }

            $query->select([
                'san_phams.id',
                'san_phams.ten_san_pham',
                'san_phams.duong_dan',
                'san_phams.anh_san_pham',
                'san_phams.hang_moi',
                DB::raw('MIN(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_thap_nhat'),
                DB::raw('MAX(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_cao_nhat'),
            ])
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->groupBy('san_phams.id');

            $sanPhams = $query->with([
                'bienTheSanPham' => function ($query) {
                    $query->with(['anhBienThe', 'mauBienThe', 'kichThuocBienThe']);
                }
            ])->paginate(12);

            $sanPhams->getCollection()->transform(function ($sanPham) {
                $bienTheData = $sanPham->bienTheSanPham->map(function ($bienThe) {
                    return [
                        'id' => $bienThe->id,
                        'san_pham_id' => $bienThe->san_pham_id,
                        'so_luong_bien_the' => $bienThe->so_luong_bien_the,
                        'ten_mau_sac' => optional($bienThe->mauBienThe)->ten_mau_sac,
                        'ma_mau_sac' => optional($bienThe->mauBienThe)->ma_mau_sac,
                        'kich_thuoc' => optional($bienThe->kichThuocBienThe)->kich_thuoc,
                        'gia_chua_giam' => $bienThe->gia_ban ?? 0,
                        'gia_hien_tai' => $bienThe->gia_khuyen_mai_tam_thoi ?? $bienThe->gia_khuyen_mai ?? $bienThe->gia_ban ?? 0,
                        'anh_bien_the' => $bienThe->anhBienThe->toArray()
                    ];
                });

                $trangThaiYeuthich = false;
                if (Auth::guard('api')->check()) {
                    $user = Auth::guard('api')->user();
                    $trangThaiYeuthich = $sanPham->khachHangYeuThich->contains('id', $user->id);
                }

                return [
                    'id' => $sanPham->id,
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'duong_dan' => $sanPham->duong_dan,
                    'anh_san_pham' => $sanPham->anh_san_pham,
                    'hang_moi' => $sanPham->hang_moi,
                    'gia_thap_nhat' => $sanPham->gia_thap_nhat,
                    'gia_cao_nhat' => $sanPham->gia_cao_nhat,
                    'bien_the' => $bienTheData,
                    'mau_sac_va_anh' => $sanPham->bienTheSanPham->map(function ($bienThe) {
                        return [
                            'ma_mau_sac' => optional($bienThe->mauBienThe)->ma_mau_sac,
                            'ten_mau_sac' => optional($bienThe->mauBienThe)->ten_mau_sac,
                            'hinh_anh' => optional($bienThe->anhBienThe->first())->duong_dan_anh,
                        ];
                    })->unique('ma_mau_sac')->values()->toArray(),
                    'trang_thai_yeu_thich' => $trangThaiYeuthich,
                    'kich_thuocs' => $sanPham->bienTheSanPham->pluck('kichThuocBienThe.kich_thuoc')->unique()->values()->toArray()
                ];
            });

            DB::commit();

            return response()->json([
                'data' => $sanPhams
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function layDanhMucMauSacKichThuoc($sanPhamIds)
    {
        try {
            DB::beginTransaction();

            $sanPhams = SanPham::whereIn('id', $sanPhamIds)->get();
            if ($sanPhams->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy sản phẩm nào.',
                ], 404);
            }

            $danhMuc = $sanPhams->first()->danhMuc()->with('children.children')->get();

            $mauSacs = BienTheMauSac::query()
                ->whereHas('sanPhams', function ($query) use ($sanPhamIds) {
                    $query->whereIn('san_pham_id', $sanPhamIds);
                })
                ->get();

            $mauSacs->map(function ($mauSac) use ($sanPhamIds) {
                $mauSac->setAttribute('so_luong_san_pham', $mauSac->sanPhams->whereIn('san_pham_id', $sanPhamIds)->count());
            });

            $kichThuoc = BienTheKichThuoc::query()
                ->whereHas('sanPhams', function ($query) use ($sanPhamIds) {
                    $query->whereIn('san_pham_id', $sanPhamIds);
                })
                ->get();

            $kichThuoc->map(function ($kichThuoc) use ($sanPhamIds) {
                $kichThuoc->setAttribute('so_luong_san_pham', $kichThuoc->sanPhams->whereIn('san_pham_id', $sanPhamIds)->count());
            });

            DB::commit();

            return response()->json([
                'danhMuc' => $danhMuc,
                'mauSac' => $mauSacs,
                'kichThuoc' => $kichThuoc
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
