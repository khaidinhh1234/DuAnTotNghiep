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
            'banner' => 'nullable|array', // Mảng banner
            'banner.*.duong_dan_anh' => 'nullable|array', // Mảng đường dẫn ảnh
            'banner.*.noi_dung.duong_dan' => 'nullable|string|max:255',
            'banner.*.noi_dung.tieu_de_chinh' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_tieu_de_chinh' => 'nullable|string|max:7',
            'banner.*.noi_dung.tieu_de_phu' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_tieu_de_phu' => 'nullable|string|max:7',
            'banner.*.noi_dung.van_ban_quang_cao' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_van_ban_quang_cao' => 'nullable|string|max:7',
            'banner.*.noi_dung.tieu_de_nut' => 'nullable|string|max:255',
            'banner.*.noi_dung.mau_nut' => 'nullable|string|max:7',
            'noi_dung_banner' => 'nullable|array', // Mảng nội dung banner
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
                foreach ($data['banner'] as &$banner) {
                    if (isset($banner['duong_dan_anh'])) {
                        $banner['duong_dan_anh'] = json_encode($banner['duong_dan_anh']);
                    }

                    if (isset($banner['noi_dung'])) {
                        $banner['noi_dung'] = json_encode($banner['noi_dung']);
                    }
                }
                $data['banner'] = json_encode($data['banner']);
            }

            if (isset($data['noi_dung_banner'])) {
                $data['noi_dung_banner'] = json_encode($data['noi_dung_banner']);
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
                'message' => $message
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Thao tác thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}
