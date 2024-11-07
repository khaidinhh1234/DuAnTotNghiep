<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMucTinTuc;
use App\Models\TinTuc;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TinTucController extends Controller
{
    public function loadDanhMucTinTucVaBaiViet()
    {
        try {
            // Lấy danh mục tin tức, trừ các danh mục không cần thiết
            $danhMucTinTuc = DanhMucTinTuc::whereNotIn('ten_danh_muc_tin_tuc', ['Dịch vụ khách hàng', 'Về chúng tôi'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Lấy bài viết theo từng danh mục tin tức
            $loadBaiVietTheoDanhMuc = DanhMucTinTuc::whereNotIn('ten_danh_muc_tin_tuc', ['Dịch vụ khách hàng', 'Về chúng tôi'])
                ->select('id', 'ten_danh_muc_tin_tuc', 'created_at')
                ->with(['tinTuc' => function ($query) {
                    $query->select('id', 'tieu_de', 'noi_dung', 'anh_tin_tuc', 'danh_muc_tin_tuc_id', 'luot_xem', 'created_at')
                        ->orderBy('created_at', 'desc')
                        ->limit(4);
                }])
                ->orderBy('created_at', 'desc')
                ->get();


            // Trả về kết quả
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'Danh_muc_tin_tuc' => $danhMucTinTuc,
                'Lay_bai_viet_theo_danh_muc' => $loadBaiVietTheoDanhMuc,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function xemBaiVietTheoDanhMuc($duongDan)
    {
        try {
            $danhMuc = DanhMucTinTuc::where('duong_dan', $duongDan)->first();


            $baiViet = TinTuc::where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->select('id', 'tieu_de', 'noi_dung', 'anh_tin_tuc', 'danh_muc_tin_tuc_id', 'created_at')
                ->orderBy('created_at', 'desc')
                ->paginate(12);

            $baiVietCoNhieuLuotXem = TinTuc::where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->select('id', 'tieu_de', 'noi_dung', 'anh_tin_tuc', 'danh_muc_tin_tuc_id', 'created_at')
                ->orderBy('luot_xem', 'desc')
                ->limit(5)
                ->get();

            // Tìm 5 bài viết có lượt xem tăng nhiều nhất trong 24 giờ qua
            $time24HoursAgo = Carbon::now()->subDay();
            $baiVietCoLuotXemTangTrong24h = TinTuc::where('danh_muc_tin_tuc_id', $danhMuc->id)
                ->where('updated_at', '>=', $time24HoursAgo)
                ->select('id', 'tieu_de', 'noi_dung', 'anh_tin_tuc', 'danh_muc_tin_tuc_id', 'luot_xem', 'created_at')
                ->orderBy('luot_xem', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy tất cả bài viết thành công.',
                'danhMuc' => [
                    'id' => $danhMuc->id,
                    'ten_danh_muc_tin_tuc' => $danhMuc->ten_danh_muc_tin_tuc,
                    'mo_ta' => $danhMuc->mo_ta,
                    'hinh_anh' => $danhMuc->hinh_anh,
                    'duong_dan' => $danhMuc->duong_dan,
                    'created_at' => $danhMuc->created_at,
                ],
                'baiViet' => $baiViet,
                'baiVietCoNhieuLuotXem' => $baiVietCoNhieuLuotXem,
                'baiVietCoLuotXemNhieuNhatTrong24h' => $baiVietCoLuotXemTangTrong24h
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy bài viết.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function xemBaiViet(Request $request, $duong_dan)
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            $baiVietDetail = TinTuc::where('duong_dan', $duong_dan)->first();

            if (!$baiVietDetail) {
                return response()->json([
                    'status' => false,
                    'status_code' => 404,
                    'message' => 'Bài viết không tồn tại.',
                ], 404);
            }

            // Tăng lượt xem cho bài viết và cập nhật lại updated_at
            $baiVietDetail->increment('luot_xem');
            $baiVietDetail->touch(); // Cập nhật lại trường `updated_at`

            // Lấy các bài viết khác cùng danh mục, ngoại trừ bài viết hiện tại
            $baiVietKhac = TinTuc::where('danh_muc_tin_tuc_id', $baiVietDetail->danh_muc_tin_tuc_id)
                ->where('id', '<>', $baiVietDetail->id)
                ->orderBy('created_at', 'desc')
                ->get();
            // Lấy top 5 bài viết có lượt xem cao nhất
            $baiVietTopLuotXem = TinTuc::with('danhMucTinTuc:id,ten_danh_muc_tin_tuc')
                ->orderBy('luot_xem', 'desc')
                ->select('id', 'tieu_de', 'anh_tin_tuc', 'luot_xem', 'created_at', 'danh_muc_tin_tuc_id')
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
