<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\ThongTinWeb;
use Illuminate\Http\Request;

class TrangChuController extends Controller
{

    public function index()
    {
        $dataBanner = ThongTinWeb::query()->select('banner')->first();
        return response()->json([
            'status' => true,
            'status_code' => 200,
            'message' => 'Lấy dữ liệu này',
            'banner' => $dataBanner
        ], 200);
    }
}
