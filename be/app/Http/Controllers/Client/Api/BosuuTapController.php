<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\BoSuuTap;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BosuuTapController extends Controller
{

//    public function index()
//    {
//        $bosuutap = BoSuuTap::query()->with([
//            'sanPhams.bienTheSanPham',
//            'sanPhams.bienTheSanPham.mauBienThe',
//            'sanPhams.bienTheSanPham.kichThuocBienThe',
//            'sanPhams.bienTheSanPham.anhBienThe',
//        ])
//            ->get();
//        return response()->json($bosuutap);
//    }

    public function show(string $slug)
    {
        try {
            $boSuuTap = BoSuuTap::where('duong_dan', $slug)->first();
            $ngayBatDau = $boSuuTap->ngay_bat_dau ? strtotime($boSuuTap->ngay_bat_dau) : null;
            $ngayHienTai = strtotime(now());

            if ($ngayBatDau) {
                if ($ngayHienTai >= $ngayBatDau) {
                    $boSuuTap['bat_dau'] = date('d-m-Y', $ngayBatDau);
                } else {
                    $boSuuTap['bat_dau'] = "Sự kiện sẽ bắt đầu vào: " . date('d-m-Y', $ngayBatDau);
                }
            } else {
                $boSuuTap['bat_dau'] = null;
            }

            if (!$boSuuTap) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Bộ sưu tập không tồn tại'
                ], 404);
            }

            $sanPhams = $boSuuTap->sanPhams()
                ->select(
                    'san_phams.id',
                    'san_phams.ten_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.anh_san_pham',
                    'san_phams.hang_moi',
                    'san_phams.gia_tot',
                    DB::raw('MIN(CASE
                    WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                    WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                    ELSE bien_the_san_phams.gia_ban
                END) as gia_thap_nhat'),
                    DB::raw('MAX(CASE
                    WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                    WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                    ELSE bien_the_san_phams.gia_ban
                END) as gia_cao_nhat')
                )
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                ->where('san_phams.trang_thai', 1)
                ->where('san_phams.hang_moi', 1)
                ->whereNotNull('san_phams.danh_muc_id')
                ->groupBy('san_phams.id', 'san_phams.ten_san_pham', 'san_phams.duong_dan', 'san_phams.anh_san_pham')
                ->orderByDesc('san_phams.id')
                ->take(8)
                ->get()
                ->map(function ($sanPham) {
                    $bienThe = BienTheSanPham::query()
                        ->with('anhBienThe')
                        ->select(
                            'bien_the_san_phams.id',
                            'bien_the_san_phams.san_pham_id',
                            'bien_the_san_phams.so_luong_bien_the',
                            'bien_the_mau_sacs.ten_mau_sac',
                            'bien_the_mau_sacs.ma_mau_sac',
                            'bien_the_kich_thuocs.kich_thuoc',
                            DB::raw('bien_the_san_phams.gia_ban as gia_chua_giam'),
                            DB::raw('CASE
                            WHEN bien_the_san_phams.gia_khuyen_mai_tam_thoi IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai_tam_thoi
                            WHEN bien_the_san_phams.gia_khuyen_mai IS NOT NULL THEN bien_the_san_phams.gia_khuyen_mai
                            ELSE bien_the_san_phams.gia_ban
                        END as gia_hien_tai')
                        )
                        ->join('bien_the_mau_sacs', 'bien_the_san_phams.bien_the_mau_sac_id', '=', 'bien_the_mau_sacs.id')
                        ->join('bien_the_kich_thuocs', 'bien_the_san_phams.bien_the_kich_thuoc_id', '=', 'bien_the_kich_thuocs.id')
                        ->where('bien_the_san_phams.san_pham_id', $sanPham->id)
                        ->get();

                    $mauSacVaAnh = $bienThe->groupBy('ma_mau_sac')->map(function ($items) {
                        $bienTheDauTien = $items->first();
                        $anhBienTheDaiDien = $bienTheDauTien->anhBienThe->first() ? $bienTheDauTien->anhBienThe->first()->duong_dan_anh : null;

                        return [
                            'ma_mau_sac' => $bienTheDauTien->ma_mau_sac,
                            'ten_mau_sac' => $bienTheDauTien->ten_mau_sac,
                            'hinh_anh' => $anhBienTheDaiDien
                        ];
                    })->values()->all();

                    $sanPham->bien_the = $bienThe;
                    $sanPham->mau_sac_va_anh = $mauSacVaAnh;

                    return $sanPham;
                });

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $sanPhams
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
