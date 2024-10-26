<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMucTinTuc;
use App\Models\TinTuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TinTucController extends Controller
{
    public function layTatCaDanhMuc(Request $request)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Lấy danh mục có cha_id là null và lấy duy nhất 1 bài viết mới nhất trong mỗi danh mục
            $danhMucTinTuc = DanhMucTinTuc::query()
                ->with([
                    'tinTuc' => function ($query) {
                        $query->select('id', 'anh_tin_tuc', 'danh_muc_tin_tuc_id')
                            ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo mới nhất
                            ->limit(1); // Lấy duy nhất 1 bài viết
                    }
                ])
                ->get();

            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'danhMucCha' => $danhMucTinTuc,
            ], 200);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();
            // Trả về lỗi
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function layBaiVietTheoDanhMuc(Request $request, $duong_dan)
    // {
    //     try {
    //         DB::beginTransaction();
    //         $baiVietMoiNhat = DanhMucTinTuc::query()
    //             ->where('duong_dan', $duong_dan)
    //             ->with([
    //                 'tinTuc' => function ($query) {
    //                     $query
    //                         ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo mới nhất
    //                         ->limit(1); // Lấy duy nhất 1 bài viết
    //                 }
    //             ])
    //             ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo mới nhất

    //             ->first(); // Lấy bài viết mới nhất

    //         DB::commit();


    //         return response()->json([
    //             'status' => true,
    //             'status_code' => 200,
    //             'message' => 'Lấy dữ liệu thành công.',
    //             'baiVietMoiNhat' => $baiVietMoiNhat,
    //             // 'baiVietKhac' => $baiVietKhac,
    //         ], 200);
    //     } catch (\Exception $e) {

    //         DB::rollBack();

    //         // Trả về lỗi
    //         return response()->json([
    //             'status' => false,
    //             'status_code' => 500,
    //             'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function layBaiVietTheoDanhMuc(Request $request, $duong_dan)
    {
        try {

            DB::beginTransaction();

            // Lấy danh mục theo đường dẫn
            $danhMuc = DanhMucTinTuc::query()
                ->where('duong_dan', $duong_dan)
                ->first();

            if (!$danhMuc) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Danh mục không tồn tại.',
                ], 404);
            }

            // Lấy bài viết mới nhất
            $baiVietMoiNhat = TinTuc::where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo mới nhất
                ->first();

            // Lấy các bài viết khác ngoại trừ bài viết mới nhất và phân trang
            $baiVietKhac = TinTuc::where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->where('id', '<>', optional($baiVietMoiNhat)->id) // Loại trừ bài viết mới nhất
                ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo
                ->paginate(10); // Phân trang với mỗi trang 10 bài viết

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'baiVietMoiNhat' => $baiVietMoiNhat,
                'baiVietKhac' => $baiVietKhac,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
