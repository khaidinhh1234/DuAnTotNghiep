<?php

namespace App\Http\Controllers\Admin\api;

use App\Http\Controllers\Controller;
use App\Models\DonHang;
use App\Models\Hoan_hang;
use App\Models\HoanTien;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HoanHangController extends Controller
{
    public function index()
    {
        try {
            $hoanHangs = Hoan_hang::query()->orderByDesc('id')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $hoanHangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi khi lấy dữ liệu danh sách hoàn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $hoanHang = Hoan_hang::query()->with([
                'donHang.chiTiets.bienTheSanPham.sanPham',
                'donHang.chiTiets.bienTheSanPham.mauBienThe',
                'donHang.chiTiets.bienTheSanPham.kichThuocBienThe',
                'donHang.chiTiets.bienTheSanPham.anhBienThe',
                'shipper',
                'donHang'
            ])->findOrFail($id);
            // Tính toán tổng số lượng và tổng tiền
            $tongSoLuong = $hoanHang->donHang->chiTiets->sum('so_luong');
            $tongTienSanPham = $hoanHang->donHang->chiTiets->sum('thanh_tien');
            //Thong tin user

            if (
                $hoanHang->donHang->ten_nguoi_dat_hang == ""
                && $hoanHang->donHang->so_dien_thoai_nguoi_dat_hang == ""
                && $hoanHang->donHang->dia_chi_nguoi_dat_hang == ""
            ) {
                $thongTin = $hoanHang->donHang->user;
            } else {
                $thongTin = [
                    'ten_nguoi_dat_hang' => $hoanHang->donHang->ten_nguoi_dat_hang === "" ? ($hoanHang->donHang->user->ho . " " . $hoanHang->donHang->user->ten) : $hoanHang->donHang->ten_nguoi_dat_hang,
                    'so_dien_thoai_nguoi_dat_hang' => $hoanHang->donHang->so_dien_thoai_nguoi_dat_hang === "" ? $hoanHang->donHang->user->so_dien_thoai : $hoanHang->donHang->so_dien_thoai_nguoi_dat_hang,
                    'dia_chi_nguoi_dat_hang' => $hoanHang->donHang->dia_chi_nguoi_dat_hang === "" ? $hoanHang->donHang->user->dia_chi : $hoanHang->donHang->dia_chi_nguoi_dat_hang
                ];
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'hoan_hang' => $hoanHang,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_tien_san_pham' => $tongTienSanPham,
                    'thong_tin' => $thongTin
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi khi lấy dữ liệu chi tiết hoàn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function capNhatTrangThaiHoanHang(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|array',
                'trang_thai_hoan_hang' => 'required'
            ]);
            DB::beginTransaction();
            $validTransitions = [
                Hoan_hang::TTHH_CLHH => Hoan_hang::TTHH_DVC,
                Hoan_hang::TTHH_DVC => Hoan_hang::TTHH_THTC,
            ];
            foreach ($validated['id'] as $id) {
                $hoanHang = Hoan_hang::findOrFail($id);
                if (
                    isset($validTransitions[$hoanHang->trang_thai_hoan_hang])
                    && $validTransitions[$hoanHang->trang_thai_hoan_hang] == $validated['trang_thai_hoan_hang']
                ) {
                    $hoanHang->update([
                        'trang_thai_hoan_hang' => $validated['trang_thai_hoan_hang']
                    ]);
                    if ($hoanHang->trang_thai_hoan_hang == Hoan_hang::TTHH_DVC) {
                        $hoanHang->update([
                            'ngay_lay_hang' => Carbon::now()
                        ]);
                    }
                    if ($hoanHang->trang_thai_hoan_hang == Hoan_hang::TTHH_THTC) {
                        $hoanHang->update([
                            'ngay_hoan_hang_thanh_cong' => Carbon::now()
                        ]);
                    }
                }
                if ($hoanHang->trang_thai_hoan_hang == Hoan_hang::TTHH_THTC) {
                    $hoanTien = HoanTien::query()->where('id', $hoanHang->hoan_tien_id)->first();
                    $giaoDichVi = $hoanTien->giaoDichVi;
                    $soDuTruoc = $giaoDichVi->viTien->so_du;
                    $giaoDichVi = $hoanTien->giaoDichVi;
                    $hoanTien->donHang->update([
                        'trang_thai_don_hang' => DonHang::TTDH_HH,
                        'ngay_hoan' => $hoanHang->ngay_tao
                    ]);
                    //Lưu giao dịch
                    DB::table('lich_su_giao_diches')->insert([
                        'vi_tien_id' => $giaoDichVi->viTien->id,
                        'so_du_truoc' => $soDuTruoc,
                        'so_du_sau' => $soDuTruoc + $hoanTien->so_tien_hoan,
                        'ngay_thay_doi' => Carbon::now(),
                        'mo_ta' => 'Hoàn tiền đơn hàng #' . $hoanTien->donHang->ma_don_hang,
                    ]);
                    $giaoDichVi->viTien->increment('so_du', $hoanTien->so_tien_hoan);
                }

            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái hoàn hàng thành công'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lỗi khi cập nhật trạng thái hoàn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
