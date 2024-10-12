<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BienTheSanPham;
use App\Models\DanhMuc;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\SanPham;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class ThongKeDanhMuc extends Controller
{
    public function doanhThuTheoDanhMuc(Request $request)
    {
        try {
            DB::beginTransaction();

            // Lấy tên danh mục từ request
            $tenDanhMuc = $request->ten_danh_muc;
            $now = Carbon::now(); // Lấy thời gian hiện tại

            // Truy vấn để lấy doanh thu tổng theo danh mục (bất kể thời gian)
            $doanhThuTong = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH)
                ->groupBy('don_hangs.id') // Group by để không bị tính trùng đơn hàng
                ->select(DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu'))
                ->first();
            // Doanh thu theo năm hiện tại
            $doanhThuNamHienTai = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH) // Đơn hàng đã giao thành công
                ->whereYear('don_hangs.created_at', $now->year) // Doanh thu theo năm hiện tại
                ->select(DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu'))
                ->first();

            // Doanh thu theo tháng hiện tại
            $doanhThuThangHienTai = DanhMuc::join('san_phams', 'danh_mucs.id', '=', 'san_phams.danh_muc_id')
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH) // Đơn hàng đã giao thành công
                ->whereMonth('don_hangs.created_at', $now->month) // Doanh thu theo tháng hiện tại
                ->whereYear('don_hangs.created_at', $now->year) // Doanh thu theo năm hiện tại
                ->select(DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu'))
                ->first();

            // Lấy thông tin các sản phẩm thuộc danh mục cùng doanh thu của từng sản phẩm
            $sanPhamDoanhThu = SanPham::join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->join('don_hang_chi_tiets', 'bien_the_san_phams.id', '=', 'don_hang_chi_tiets.bien_the_san_pham_id')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->join('danh_mucs', 'san_phams.danh_muc_id', '=', 'danh_mucs.id')
                ->where('danh_mucs.ten_danh_muc', $tenDanhMuc)
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH) // Đơn hàng đã giao thành công
                ->select(
                    'san_phams.ten_san_pham',
                    DB::raw('SUM(don_hangs.tong_tien_don_hang) as tong_doanh_thu_san_pham')
                )
                ->groupBy('san_phams.id', 'san_phams.ten_san_pham')
                ->get();

            DB::commit();

            return response()->json([
                'doanh_thu_tong' => $doanhThuTong->tong_doanh_thu ?? 0,
                'doanh_thu_nam_hien_tai' => $doanhThuNamHienTai->tong_doanh_thu ?? 0,
                'doanh_thu_thang_hien_tai' => $doanhThuThangHienTai->tong_doanh_thu ?? 0,
                'san_pham_doanh_thu' => $sanPhamDoanhThu,
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi', 'message' => $e->getMessage()], 500);
        }
    }
    public function layTatCaDanhMuc()
    {
        // 1. Lấy tất cả danh mục cha (các danh mục có cha_id là null)
        $danhMucCha = DanhMuc::whereNull('cha_id')->with('children')->get();

        // 2. Tạo mảng để chứa kết quả
        $data = [];

        // 3. Lặp qua từng danh mục cha và lấy danh mục con
        foreach ($danhMucCha as $danhMuc) {
            // Mỗi danh mục cha sẽ có danh sách danh mục con, nếu không có thì trả về mảng rỗng
            $danhMucCons = $danhMuc->children ?? [];

            // Sử dụng map trên mảng danh mục con (hoặc mảng rỗng)
            $data[] = [
                'ten_danh_muc_cha' => $danhMuc->ten_danh_muc,
                'danh_muc_cons' => $danhMucCons->map(function ($danhMucCon) {
                    return [
                        'ten_danh_muc_con' => $danhMucCon->ten_danh_muc,
                    ];
                })
            ];
        }

        // 4. Trả về kết quả
        return response()->json($data);
    }


    public function thongKeDoanhThuTheoDanhMuc(Request $request)
    {
        // Lấy tham số danh_muc_con_id và danh_muc_cha_id từ request
        $danhMucConId = $request->danh_muc_con_id;
        $danhMucChaId = $request->danh_muc_cha_id;

        // 1. Kiểm tra danh_muc_con_id có thuộc về danh_muc_cha_id hay không
        if ($danhMucConId) {
            // Tìm danh mục con theo ID
            $danhMucCon = DanhMuc::where('id', $danhMucConId)
                ->where('cha_id', $danhMucChaId)
                ->first();

            // Nếu không tìm thấy danh mục con phù hợp, trả về lỗi
            if (!$danhMucCon) {
                return response()->json([
                    'error' => 'Danh mục con không thuộc danh mục cha hoặc không tồn tại.'
                ], 400);
            }
        }

        // 2. Lấy tất cả danh mục con thuộc danh mục cha
        $danhMucCons = DanhMuc::where('cha_id', $danhMucChaId)->with('sanPhams.bienTheSanPham')->get();

        // Mảng chứa dữ liệu danh mục con và doanh thu
        $data = [];

        foreach ($danhMucCons as $danhMucCon) {
            // 3. Khởi tạo tổng doanh thu cho danh mục con
            $tongDoanhThuDanhMucCon = 0;

            // Mảng chứa dữ liệu từng sản phẩm trong danh mục con
            $sanPhamData = [];

            // 4. Lấy tất cả sản phẩm và biến thể của danh mục con
            foreach ($danhMucCon->sanPhams as $sanPham) {
                $tongDoanhThuSanPham = 0;

                foreach ($sanPham->bienTheSanPham as $bienTheSanPham) {
                    // 5. Lấy chi tiết đơn hàng của từng biến thể sản phẩm
                    $doanhThuBienThe = DonHangChiTiet::where('bien_the_san_pham_id', $bienTheSanPham->id)
                        ->whereHas('donHang', function ($query) {
                            // Lọc những đơn hàng đã giao hàng thành công
                            $query->where('trang_thai_don_hang', DonHang::TTDH_HTDH);
                        })
                        ->sum('thanh_tien'); // Tổng doanh thu của biến thể sản phẩm

                    // Cộng doanh thu của biến thể vào doanh thu tổng của sản phẩm
                    $tongDoanhThuSanPham += $doanhThuBienThe;
                }

                // Cộng doanh thu của sản phẩm vào doanh thu tổng của danh mục con
                $tongDoanhThuDanhMucCon += $tongDoanhThuSanPham;

                // Chỉ thêm thông tin sản phẩm nếu có danh_muc_con_id
                if ($danhMucConId) {
                    // Lưu thông tin từng sản phẩm
                    $sanPhamData[] = [
                        'ten_san_pham' => $sanPham->ten_san_pham,
                        'doanh_thu' => $tongDoanhThuSanPham,
                    ];
                }
            }

            // 6. Tính phần trăm doanh thu của từng sản phẩm trong tổng doanh thu của danh mục con
            if ($danhMucConId) {
                foreach ($sanPhamData as &$sp) {
                    if ($tongDoanhThuDanhMucCon > 0) {
                        $sp['phan_tram'] = round(($sp['doanh_thu'] / $tongDoanhThuDanhMucCon) * 100, 2);
                    } else {
                        $sp['phan_tram'] = 0;
                    }
                }
            }

            // 7. Lưu thông tin của danh mục con và sản phẩm thuộc danh mục đó nếu có danh_muc_con_id
            $data[] = [
                'ten_danh_muc_con' => $danhMucCon->ten_danh_muc,
                'tong_doanh_thu_danh_muc_con' => $tongDoanhThuDanhMucCon,
                // Chỉ thêm danh sách sản phẩm nếu có danh_muc_con_id
                'san_phams' => $danhMucConId ? $sanPhamData : []
            ];
        }

        // Trả về kết quả
        return response()->json($data);
    }

    public function demSoLuongSPBanTheoDanhMuc(Request $request)
    {
        // Lấy id của danh mục cha từ request
        $id = $request->id;

        // Lấy danh mục cha dựa trên id được truyền vào
        $parentCategory = DanhMuc::with('children')->find($id);

        if (!$parentCategory) {
            return response()->json(['message' => 'Danh mục không tồn tại.'], 404);
        }

        // Lấy số lượng sản phẩm được bán trong từng danh mục con
        $result = [];

        foreach ($parentCategory->children as $child) {
            // Lấy tất cả các sản phẩm thuộc danh mục con
            $sanPhamIds = $child->sanPhams()->pluck('id');

            // Tính tổng số lượng sản phẩm đã bán trong các đơn hàng đã giao hàng thành công
            $soldCount = DB::table('don_hang_chi_tiets')
                ->join('don_hangs', 'don_hang_chi_tiets.don_hang_id', '=', 'don_hangs.id')
                ->where('don_hangs.trang_thai_don_hang', DonHang::TTDH_HTDH) // Chỉ tính đơn hàng thành công
                ->whereIn('don_hang_chi_tiets.bien_the_san_pham_id', function($query) use ($sanPhamIds) {
                    $query->select('id')
                          ->from('bien_the_san_phams')
                          ->whereIn('san_pham_id', $sanPhamIds);
                })
                ->sum('don_hang_chi_tiets.so_luong');

            $result[] = [
                'danh_muc_id' => $child->id,
                'ten_danh_muc' => $child->ten_danh_muc,
                'so_luong_ban' => $soldCount,
            ];
        }

        return response()->json($result);
    }
        public function demDHTheoDanhMuc(Request $request)
        {
            // Lấy id của danh mục cha từ request
            $id = $request->id;

            // Lấy danh mục cha dựa trên id được truyền vào
            $parentCategory = DanhMuc::with('children')->find($id);

            if (!$parentCategory) {
                return response()->json(['message' => 'Danh mục không tồn tại.'], 404);
            }

            // Lấy số lượng đơn hàng đã giao thành công trong từng danh mục con
            $result = [];

            foreach ($parentCategory->children as $child) {
                $successfulOrderCount = DB::table('don_hangs')
                    ->where('trang_thai_don_hang', DonHang::TTDH_HTDH) // Đơn hàng đã giao thành công
                    ->whereIn('id', function ($query) use ($child) {
                        $query->select('don_hang_id')
                              ->from('don_hang_chi_tiets')
                              ->whereIn('bien_the_san_pham_id', $child->sanPhams()->pluck('id'));
                    })
                    ->count();

                $result[] = [
                    'danh_muc_id' => $child->id,
                    'ten_danh_muc' => $child->ten_danh_muc,
                    'so_luong_don_hang_thanh_cong' => $successfulOrderCount,
                ];
            }

            return response()->json($result);
        }
        public function demDHHuyTheoDanhMuc(Request $request)
        {
            // Lấy id của danh mục cha từ request
            $id = $request->id;

            // Lấy danh mục cha dựa trên id được truyền vào
            $parentCategory = DanhMuc::with('children')->find($id);

            if (!$parentCategory) {
                return response()->json(['message' => 'Danh mục không tồn tại.'], 404);
            }

            // Lấy số lượng đơn hàng bị hủy hoặc trả lại trong từng danh mục con
            $result = [];

            foreach ($parentCategory->children as $child) {
                $canceledOrderCount = DB::table('don_hangs')
                    ->where('trang_thai_don_hang', DonHang::TTDH_DH,DonHang::TTDH_HH) // Đơn hàng bị hủy hoặc trả lại
                    ->whereIn('id', function ($query) use ($child) {
                        $query->select('don_hang_id')
                              ->from('don_hang_chi_tiets')
                              ->whereIn('bien_the_san_pham_id', $child->sanPhams()->pluck('id'));
                    })
                    ->count();


                $result[] = [
                    'danh_muc_id' => $child->id,
                    'ten_danh_muc' => $child->ten_danh_muc,
                    'so_luong_don_hang_bi_huy' => $canceledOrderCount,
                ];
            }

            return response()->json($result);
        }


}
