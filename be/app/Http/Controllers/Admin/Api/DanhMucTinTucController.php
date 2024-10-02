<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMucTinTuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DanhMucTinTucController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $danhMucTinTucs = DanhMucTinTuc::orderBy('created_at', 'desc')->get();
            return response()->json(
                [
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => $danhMucTinTucs,
                ],
                200
            );
        } catch (\Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
