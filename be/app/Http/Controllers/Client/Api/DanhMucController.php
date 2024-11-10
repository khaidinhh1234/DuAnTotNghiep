<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\DanhMuc;
use App\Models\SanPham;
use App\Traits\LocSanPhamTrait;
use Exception;
use Illuminate\Http\Request;

class DanhMucController extends Controller
{
    use LocSanPhamTrait;

    public function laySanPhamTheoDanhMuc(Request $request, $tenDanhMucCha, $tenDanhMucCon = null, $tenDanhMucConCapBa = null)
    {
        try {
            $danhMucCha = DanhMuc::query()->where('duong_dan', $tenDanhMucCha)->first();

            if (!$danhMucCha) {
                return response()->json(['message' => 'Không tìm thấy danh mục'], 404);
            }

            $sanPhams = null;
            $danhMucPath = [$danhMucCha->ten_danh_muc];

            if ($tenDanhMucCon) {
                $danhMucCon = DanhMuc::where('duong_dan', $tenDanhMucCon)->first();

                if (!$danhMucCon) {
                    return response()->json(['message' => 'Danh mục con không tồn tại'], 404);
                }

                $danhMucPath[] = $danhMucCon->ten_danh_muc;

                if ($tenDanhMucConCapBa) {
                    $danhMucConCapBa = DanhMuc::where('duong_dan', $tenDanhMucConCapBa)->first();

                    if (!$danhMucConCapBa) {
                        return response()->json(['message' => 'Danh mục con cấp ba không tồn tại'], 404);
                    }

                    $sanPhams = SanPham::where('danh_muc_id', $danhMucConCapBa->id);
                    $danhMucPath[] = $danhMucConCapBa->ten_danh_muc;
                } else {
                    $danhMucConIds = DanhMuc::where('cha_id', $danhMucCon->id)->pluck('id');
                    $sanPhams = SanPham::whereIn('danh_muc_id', $danhMucConIds);
                }
            } else {
                $danhMucIds = $this->layDanhMucIds($danhMucCha);
                $sanPhams = SanPham::whereIn('danh_muc_id', $danhMucIds);
            }

            $sanPhamIds = $sanPhams->pluck('id')->toArray();
            if (empty($sanPhamIds)) {
                return response()->json([
                    'status' => true,
                    'status_code' => 200,
                    'message' => 'Lấy dữ liệu thành công',
                    'data' => [
                        'danh_muc' => [
                            'ten_danh_muc' => implode(' > ', $danhMucPath),
                            'anh_danh_muc' => $danhMucCha->anh_danh_muc,
//                            'duong_dan' => $danhMucCha->duong_dan,
                        ],
                        'san_pham' => [],
                        'danh_sach_loc' => []
                    ],
                ], 200);
            }

            $sanPhamDetails = $this->locSanPham($sanPhamIds, $request);
            $danhSachLoc = $this->layDanhMucMauSacKichThuoc($sanPhamIds);
            $sanPhamData = $sanPhamDetails->getData();
            $sanPhams = $sanPhamData->data;

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => [
                    'danh_muc' => [
                        'ten_danh_muc' => implode(' > ', $danhMucPath),
                        'anh_danh_muc' => $danhMucCha->anh_danh_muc,
//                        'duong_dan' => $danhMucCha->duong_dan,
                    ],
                    'san_pham' => $sanPhams,
                    'danh_sach_loc' => $danhSachLoc
                ],
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    protected function layDanhMucIds($danhMuc)
    {
        $ids = [$danhMuc->id];
        foreach ($danhMuc->children as $child) {
            $ids = array_merge($ids, $this->layDanhMucIds($child));
        }
        return $ids;
    }
}
