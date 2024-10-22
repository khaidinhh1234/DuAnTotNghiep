<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BoSuuTap;
use Illuminate\Http\Request;

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
            $data = BoSuuTap::query()
                ->with([
                    'sanPhams.bienTheSanPham',
                    'sanPhams.bienTheSanPham.mauBienThe',
                    'sanPhams.bienTheSanPham.kichThuocBienThe',
                    'sanPhams.bienTheSanPham.anhBienThe',
                ])
                ->where('duong_dan', $slug)->first();
            $json = [
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => $data
            ];

            return response()->json($json, 200);
        }catch (\Exception $e) {
            $json = [
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy dữ liệu thất bại',
                'error' => $e->getMessage(),
            ];

            return response()->json($json, 500);
        }
    }


}
