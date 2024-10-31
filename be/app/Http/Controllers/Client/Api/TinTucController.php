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

            $danhMucTinTuc = DanhMucTinTuc::query()
                ->with([
                    'tinTuc' => function ($query) {
                        $query->select('id', 'anh_tin_tuc', 'danh_muc_tin_tuc_id')
                            ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo mới nhất
                            ->get();
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
            // Bắt đầu transaction
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

            // Lấy bài viết mới nhất của danh mục
            $baiVietMoiNhat = TinTuc::with('danhMucTinTuc') // Thêm `with` để lấy quan hệ danh mục
                ->where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->orderBy('created_at', 'desc')
                ->first();

            // Lấy các bài viết khác trong danh mục (loại trừ bài viết mới nhất)
            $baiVietLienQuan = TinTuc::with('danhMucTinTuc') // Thêm `with` để lấy quan hệ danh mục
                ->where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->where('id', '<>', optional($baiVietMoiNhat)->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

                $baiVietKhac = $baiVietLienQuan->map(function($baiViet): array{
                    return [
                        'id' => $baiViet->id,
                        'user_id' => $baiViet->user_id,
                        'danh_muc_tin_tuc_id' => $baiViet->danh_muc_tin_tuc_id,
                        'tieu_de' => $baiViet->tieu_de,
                        'anh_tin_tuc' => $baiViet->anh_tin_tuc ?? 'default_image.jpg', // Gán ảnh mặc định nếu null,
                        'noi_dung' => $baiViet->noi_dung,
                        'duong_dan_bai_viet' => $baiViet->duong_dan,
                        'created_at' => $baiViet->created_at,
                        'updated_at' => $baiViet->updated_at,
                        'deleted_at' => $baiViet->deleted_at,
                        'luot_xem' => $baiViet->luot_xem,
                        'danh_muc_tin_tuc' => $baiViet->danhMucTinTuc ? [
                            'id' => $baiViet->danhMucTinTuc->id,
                            'ten_danh_muc_tin_tuc' => $baiViet->danhMucTinTuc->ten_danh_muc_tin_tuc,
                            'duong_dan' => $baiViet->danhMucTinTuc->duong_dan,
                        ] : null,
                    ];
                });
            // Lấy top 5 bài viết có lượt xem cao nhất
            $baiVietTop5 = TinTuc::with('danhMucTinTuc:id,ten_danh_muc_tin_tuc')
            ->orderBy('luot_xem', 'desc')
            // ->select('id', 'tieu_de', 'anh_tin_tuc', 'luot_xem', 'created_at','danh_muc_tin_tuc_id')
            ->limit(5)
            ->get();
            $baiVietTopLuotXem = $baiVietTop5->map(function($baiViet): array{
                return [
                    'id' => $baiViet->id,
                    'user_id' => $baiViet->user_id,
                    'danh_muc_tin_tuc_id' => $baiViet->danh_muc_tin_tuc_id,
                    'tieu_de' => $baiViet->tieu_de,
                    'anh_tin_tuc' => $baiViet->anh_tin_tuc ?? 'default_image.jpg', // Gán ảnh mặc định nếu null,
                    'noi_dung' => $baiViet->noi_dung,
                    'duong_dan_bai_viet' => $baiViet->duong_dan,
                    'created_at' => $baiViet->created_at,
                    'updated_at' => $baiViet->updated_at,
                    'deleted_at' => $baiViet->deleted_at,
                    'luot_xem' => $baiViet->luot_xem,
                    'danh_muc_tin_tuc' => $baiViet->danhMucTinTuc ? [
                        'id' => $baiViet->danhMucTinTuc->id,
                        'ten_danh_muc_tin_tuc' => $baiViet->danhMucTinTuc->ten_danh_muc_tin_tuc,
                        'duong_dan' => $baiViet->danhMucTinTuc->duong_dan,
                    ] : null,
                ];
            });

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'baiVietMoiNhatCuaDanhMuc' => $baiVietMoiNhat,
                'baiVietKhacCuaDanhMuc' => $baiVietKhac,
                'baiVietTop' => $baiVietTopLuotXem,
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


    public function xemBaiViet(Request $request, $duong_dan_tt)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            $baiVietDetail = TinTuc::where('duong_dan', $duong_dan_tt)->first();

            if (!$baiVietDetail) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Bài viết không tồn tại.',
                ], 404);
            }

            // Lấy các bài viết khác cùng danh mục, ngoại trừ bài viết hiện tại
            $baiVietKhac = TinTuc::where('danh_muc_tin_tuc_id', $baiVietDetail->danh_muc_tin_tuc_id)
                ->where('id', '<>', $baiVietDetail->id)
                ->orderBy('created_at', 'desc')
                ->get();
             // Lấy top 5 bài viết có lượt xem cao nhất
             $baiVietTopLuotXem = TinTuc::with('danhMucTinTuc:id,ten_danh_muc_tin_tuc')
             ->orderBy('luot_xem', 'desc')
             ->select('id', 'tieu_de', 'anh_tin_tuc', 'luot_xem', 'created_at','danh_muc_tin_tuc_id')
             ->limit(5)
             ->get();

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'baiVietDetail' => $baiVietDetail,
                'baiVietKhac' => $baiVietKhac,
                'baiVietTop' => $baiVietTopLuotXem,
            ], 200);
        } catch (\Exception $e) {
            // Rollback nếu có lỗi
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
