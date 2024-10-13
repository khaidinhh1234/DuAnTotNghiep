<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\ThongTinWeb;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ThongTinWebController extends Controller
{
    /**
     * Get the single resource.
     */
    public function index()
    {
        try {
            // Lấy thông tin website đầu tiên
            $thongTinWeb = ThongTinWeb::first();

            if (!$thongTinWeb) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có dữ liệu'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $thongTinWeb,
                'message' => 'Dữ liệu được lấy thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lấy dữ liệu thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store or update the single resource.
     */
    public function storeOrUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_website' => 'nullable|string|max:255',
            'logo_website' => 'nullable|string|max:255',
            'ten_doanh_nghiep' => 'nullable|string|max:255',
            'dia_chi' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'so_dien_thoai_dat_hang' => 'nullable|string|max:15',
            'so_dien_thoai_khieu_nai' => 'nullable|string|max:15',
            'cau_noi' => 'nullable|string|max:255',
            'link_facebook' => 'nullable|string|max:255',
            'link_youtube' => 'nullable|string|max:255',
            'link_zalo' => 'nullable|string|max:255',
            'link_instagram' => 'nullable|string|max:255',
            'link_tiktok' => 'nullable|string|max:255',
            'banner' => 'nullable|array',
            'banner.*.duong_dan_anh' => 'nullable|string|max:255',
            'banner.*.vi_tri' => 'required|integer|in:1,2,3,4,5,6,7,8,9,10', // Yêu cầu vi_tri phải là 1-10
            'banner.*.noi_dung' => 'nullable|array',
            'banner.*.noi_dung.tieu_de_chinh' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_tieu_de_chinh' => 'nullable|string|max:7',
            'banner.*.noi_dung.tieu_de_phu' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_tieu_de_phu' => 'nullable|string|max:7',
            'banner.*.noi_dung.van_ban_quang_cao' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_van_ban_quang_cao' => 'nullable|string|max:7',
            'banner.*.noi_dung.tieu_de_nut' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_nut' => 'nullable|string|max:7',
            'banner.*.noi_dung.duong_link' => 'nullable|string|max:255',
            'banner.*.loai_banner' => 'nullable|in:1,2', // 1 Banner quảng cáo sản phẩm, 2 Banner quảng cáo dịch vụ
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = $request->all();

            if (isset($data['banner'])) {
                // Kiểm tra trùng lặp vị trí
                $positions = array_column($data['banner'], 'vi_tri');
                $duplicatePositions = array_filter(array_count_values($positions), function ($count) {
                    return $count > 1;
                });

                if (!empty($duplicatePositions)) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Vị trí banner bị trùng lặp.',
                        'duplicate_positions' => array_keys($duplicatePositions),
                    ], 422);
                }
            }

            $thongTinWeb = ThongTinWeb::first();

            if ($thongTinWeb) {
                $thongTinWeb->update($data);
                $message = 'Cập nhật dữ liệu thành công';
            } else {
                $thongTinWeb = ThongTinWeb::create($data);
                $message = 'Thêm dữ liệu thành công';
            }

            return response()->json([
                'status' => true,
                'data' => $thongTinWeb,
                'message' => $message,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Thao tác thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
