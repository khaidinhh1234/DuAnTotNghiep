<?php

namespace App\Http\Controllers\Admin\Api;

use App\Events\ThongBaoMoi;
use App\Exports\DonHangExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDonHangRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Listeners\CapNhatHangThanhVien;
use App\Models\DonHang;
use App\Models\GiaoDichVi;
use App\Models\Hoan_hang;
use App\Models\HoanTien;
use App\Models\MaKhuyenMai;
use App\Models\ThongBao;
use App\Models\ThongTinWeb;
use App\Models\User;
use App\Models\VanChuyen;
use App\Models\YeuCauRutTien;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class DonHangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $donHangs = DonHang::with('chiTiets', 'user')->orderByDesc('id')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $donHangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $donHang = DonHang::with([
                'chiTiets.bienTheSanPham.sanPham', // Lấy sản phẩm từ biến thể
                'chiTiets.bienTheSanPham.mauBienThe', // Lấy màu biến thể
                'chiTiets.bienTheSanPham.kichThuocBienThe', // Lấy kích thước biến thể
                'chiTiets.bienTheSanPham.anhBienThe', // Lấy ảnh biến thể
                'danhGias.user', // Lấy đánh giá của đơn hàng
                'vanChuyen',
                // 'user'
            ])->findOrFail($id);

            // Tính toán tổng số lượng và tổng tiền
            $tongSoLuong = $donHang->chiTiets->sum('so_luong');
            $tongTienSanPham = $donHang->chiTiets->sum('thanh_tien');

            // Chuẩn bị dữ liệu đơn hàng chi tiết với tên sản phẩm, ảnh, số lượng và giá
            $chiTietDonHang = $donHang->chiTiets->map(function ($chiTiet) {
                // Lấy các đường dẫn ảnh biến thể từ bảng anh_bien_thes
                $anhBienThe = $chiTiet->bienTheSanPham->anhBienThe->pluck('duong_dan_anh')->toArray();

                // Lấy ảnh sản phẩm (giả sử có một trường duong_dan_anh trong bảng san_phams)
                $anhSanPham = $chiTiet->bienTheSanPham->sanPham->duong_dan_anh;

                return [
                    'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                    'anh_san_pham' => $anhSanPham,
                    'mau_bien_the' => $chiTiet->bienTheSanPham->mauBienThe->ten_mau_sac,
                    'kich_thuoc_bien_the' => $chiTiet->bienTheSanPham->kichThuocBienThe->kich_thuoc,
                    'anh_bien_the' => $anhBienThe,
                    'so_luong' => $chiTiet->so_luong,
                    'gia' => $chiTiet->bianTheSanPham->gia_khuyen_mai_tam_thoi ?? $chiTiet->bienTheSanPham->gia_khuyen_mai ?? $chiTiet->bienTheSanPham->gia_ban,
                    'thanh_tien' => $chiTiet->so_luong * ($chiTiet->bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $chiTiet->bienTheSanPham->gia_khuyen_mai ?? $chiTiet->bienTheSanPham->gia_ban),
                ];
            });

            // Lấy đánh giá của đơn hàng
            $danhGiaDonHang = $donHang->danhGia;
            $danhGiaData = null;
            if ($danhGiaDonHang) {
                $danhGiaData = [
                    'so_sao_san_pham' => $danhGiaDonHang->so_sao_san_pham,
                    'so_sao_dich_vu_van_chuyen' => $danhGiaDonHang->so_sao_dich_vu_van_chuyen,
                    'chat_luong_san_pham' => $danhGiaDonHang->chat_luong_san_pham,
                    'mo_ta' => $danhGiaDonHang->mo_ta,
                    'phan_hoi' => $danhGiaDonHang->phan_hoi,
                    'huu_ich' => $danhGiaDonHang->huu_ich
                ];
            }

            //Thong tin user

            if (
                $donHang->ten_nguoi_dat_hang == ""
                && $donHang->so_dien_thoai_nguoi_dat_hang == ""
                && $donHang->dia_chi_nguoi_dat_hang == ""
            ) {
                $thongTin = $donHang->user;
            } else {
                $thongTin = [
                    'ten_nguoi_dat_hang' => $donHang->ten_nguoi_dat_hang === "" ? ($donHang->user->ho . " " . $donHang->user->ten) : $donHang->ten_nguoi_dat_hang,
                    'so_dien_thoai_nguoi_dat_hang' => $donHang->so_dien_thoai_nguoi_dat_hang === "" ? $donHang->user->so_dien_thoai : $donHang->so_dien_thoai_nguoi_dat_hang,
                    'dia_chi_nguoi_dat_hang' => $donHang->dia_chi_nguoi_dat_hang === "" ? $donHang->user->dia_chi : $donHang->dia_chi_nguoi_dat_hang
                ];
            }
            $maGiamGia = MaKhuyenMai::where('ma_code', $donHang->ma_giam_gia)->first();
            $soTienGiamGia = 0;
            if ($donHang->ma_giam_gia) {

                $soTienGiamGia = $maGiamGia->loai === 'phan_tram'
                    ? ($donHang->tong_tien_don_hang * $maGiamGia->giam_gia / 100)
                    : $maGiamGia->giam_gia;

                if ($soTienGiamGia > $donHang->tong_tien_don_hang) {
                    $soTienGiamGia = $donHang->tong_tien_don_hang;
                }
            }
            // Tính tiền ship
            $tienShip = $donHang->mien_phi_van_chuyen == 1 ? 0 : 20000;
            $tietKiemShip = $donHang->mien_phi_van_chuyen == 1 ? 20000 : 0;

            // Chuẩn bị phản hồi với đầy đủ thông tin
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'thong_tin' => $thongTin,
                    'don_hang' => $donHang,
                    'chi_tiet_cua_don_hang' => $chiTietDonHang,
                    'tong_so_luong' => $tongSoLuong,
                    'tong_thanh_tien_san_pham' => $tongTienSanPham,
                    'tien_ship' => $tienShip,
                    'so_tien_giam_gia' => $soTienGiamGia,
                    'tiet_kiem' => $soTienGiamGia + $tietKiemShip,
                    'tong_tien' => $donHang->tong_tien_don_hang - $soTienGiamGia,
                    'anh_xac_thuc' => $donHang->vanChuyen->anh_xac_thuc ?? '',
                    'danh_gia' => $danhGiaData // Thông tin đánh giá
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 404,
                'message' => 'Không tìm thấy đơn hàng.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Cập nhập trạng thái thanh toán
    public function updatePaymentStatus(UpdatePaymentStatusRequest $request)
    {
        try {
            foreach ($request->id as $id) {

                DB::beginTransaction();
                $donHang = DonHang::findOrFail($id);

                // Cập nhật trạng thái thanh toán bằng phương thức update()
                $donHang->update([
                    'trang_thai_thanh_toan' => $request->trang_thai_thanh_toan
                ]);

                DB::commit();
            }
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái thanh toán thành công.',
                // 'don_hang' => $donHang
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi thay đổi trạng thái thanh toán đơn hàng.',
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    // Cập nhật trạng thái đơn hàng
    public function capNhatTrangThaiDonHang(UpdateDonHangRequest $request)
    {
        try {
            DB::beginTransaction();
            $messages = [];

            foreach ($request->id as $id) {
                $donHang = DonHang::findOrFail($id);
                if ($donHang->trang_thai_don_hang != DonHang::TTDH_DH) {
                    $shippers = User::query()->with('vaiTros')->whereHas('vaiTros', function ($query) {
                        $query->where('ten_vai_tro', 'Người giao hàng');
                    })->get();
                    if (in_array($donHang->trang_thai_don_hang, [DonHang::TTDH_DGH, DonHang::TTDH_CKHCN]) && $request->trang_thai_don_hang === DonHang::TTDH_DH) {
                        $messages[] = 'Không thể hủy đơn hàng khi đơn hàng đang được giao hoặc đã giao thành công.';
                        continue;
                    }

                    $validTransitions = [
                        DonHang::TTDH_CXH => [DonHang::TTDH_DXH, DonHang::TTDH_DH],
                        DonHang::TTDH_DXH => [DonHang::TTDH_DXL, DonHang::TTDH_DH],
                        DonHang::TTDH_DXL => [DonHang::TTDH_DGH, DonHang::TTDH_DH],
                        DonHang::TTDH_DGH => [DonHang::TTDH_CKHCN, DonHang::TTDH_DHTB],
                        DonHang::TTDH_CKHCN => [DonHang::TTDH_HTDH],
                        DonHang::TTDH_HTDH => [DonHang::TTDH_HH],
                        DonHang::TTDH_DH => [DonHang::TTDH_CXH, DonHang::TTDH_DXH, DonHang::TTDH_DXL],
                    ];

                    if (!isset($validTransitions[$donHang->trang_thai_don_hang]) || !in_array($request->trang_thai_don_hang, $validTransitions[$donHang->trang_thai_don_hang])) {
                        $messages[] = 'Không thể cập nhật trạng thái ngược lại hoặc trạng thái không hợp lệ.';
                        continue;
                    }

                    $trangThaiCu = $donHang->trang_thai_don_hang;

                    if ($trangThaiCu === $request->trang_thai_don_hang) {
                        continue;
                    }

                    if ($request->trang_thai_don_hang == DonHang::TTDH_DH) {
                        $donHang->chiTiets->each(function ($chiTiet) {
                            $chiTiet->bienTheSanPham->increment('so_luong_bien_the', $chiTiet->so_luong);
                        });
                        $donHang->update([
                            'ly_do_huy' => $request->ly_do_huy,
                            'ngay_huy' => Carbon::now(),
                        ]);
                    }

                    if ($request->trang_thai_don_hang == DonHang::TTDH_DH && $donHang->trang_thai_thanh_toan == DonHang::TTTT_DTT) {
                        DB::table('lich_su_giao_diches')->insert([
                            'vi_tien_id' => $donHang->user->viTien->id,
                            'so_du_truoc' => $donHang->user->viTien->so_du,
                            'so_du_sau' => $donHang->user->viTien->so_du + $donHang->tong_tien_don_hang,
                            'ngay_thay_doi' => Carbon::now(),
                            'mo_ta' => 'Hoàn tiền đơn hàng #' . $donHang->ma_don_hang,
                        ]);
                        $donHang->user->viTien->increment('so_du', $donHang->tong_tien_don_hang);
                    }
                    if ($request->trang_thai_don_hang == DonHang::TTDH_DH && in_array($donHang->trang_thai_don_hang, [DonHang::TTDH_DXH, DonHang::TTDH_DXL])) {
                        $donHang->update([
                            'trang_thai_don_hang' => DonHang::TTDH_CXNDH,
                        ]);
                    }
                    $donHang->update(['trang_thai_don_hang' => $request->trang_thai_don_hang]);

                    if ($request->trang_thai_don_hang === DonHang::TTDH_DXL) {
                        if ($shippers->isEmpty()) {
                            throw new \Exception('Không có shipper nào trong hệ thống');
                        }

                        $minDonHangCount = $shippers->min(fn($shipper) => $shipper->vanChuyens->count());
                        $shippersWithMinDonHang = $shippers->filter(fn($shipper) => $shipper->vanChuyens->count() == $minDonHangCount);
                        $shipper = $shippersWithMinDonHang->random();

                        $vanChuyen = VanChuyen::create([
                            'don_hang_id' => $donHang->id,
                            'user_id' => $donHang->user_id,
                            'shipper_id' => $shipper->id,
                            'ngay_tao' => Carbon::now(),
                            'trang_thai_van_chuyen' => VanChuyen::TTVC_CXL,
                            'cod' => $donHang->phuong_thuc_thanh_toan !== DonHang::PTTT_TT ? VanChuyen::TTCOD_KT : VanChuyen::TTCOD_CN,
                            'tien_cod' => $donHang->phuong_thuc_thanh_toan !== DonHang::PTTT_TT ? 0 : $donHang->tong_tien_don_hang,
                        ]);

                        $thongBaoTele = new ThongBaoTelegramController();
                        $thongBaoTele->thongBaoDonHangMoi($vanChuyen->id);
                    }

                    $thongBao = ThongBao::create([
                        'user_id' => $donHang->user_id,
                        'tieu_de' => 'Đơn hàng của bạn đã có cập nhật mới',
                        'noi_dung' => 'Đơn hàng ' . $donHang->ma_don_hang . ' đã được cập nhật từ trạng thái ' .
                            DonHang::getTrangThaiDonHang($trangThaiCu) . ' sang ' .
                            DonHang::getTrangThaiDonHang($request->trang_thai_don_hang),
                        'loai' => 'Đơn hàng',
                        'duong_dan' => $donHang->ma_don_hang,
                        'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                    ]);

                    broadcast(new ThongBaoMoi($thongBao))->toOthers();

                    $userAdmin = User::query()->with('vaiTros')
                        ->whereHas('vaiTros', function ($query) {
                            $query->where('ten_vai_tro', 'Quản trị viên');
                        })->first();

                    $thongBao = ThongBao::create([
                        'user_id' => $userAdmin->id,
                        'tieu_de' => 'Đơn hàng ' . $donHang->ma_don_hang . ' đã có cập nhật mới',
                        'noi_dung' => '',
                        'loai' => 'Rút tiền',
                        'duong_dan' => $donHang->ma_don_hang,
                        'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                    ]);

                    broadcast(new ThongBaoMoi($thongBao))->toOthers();
                }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Cập nhật trạng thái đơn hàng thành công.',
                'data' => $messages,
            ], 200);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
    public function export()
    {
        // Tải xuống file Excel với tên 'donhang.xlsx'
        return Excel::download(new DonHangExport, 'donhang.xlsx');
    }

    public function inHoaDon(string $id)
    {
        $thongTinWeb = ThongTinWeb::first();
        $hoaDon = DonHang::query()
            ->with([
                'user',
                'chiTiets.bienTheSanPham.sanPham',
                'chiTiets.bienTheSanPham.mauBienThe',
                'chiTiets.bienTheSanPham.kichThuocBienThe',
                'vanChuyen'
            ])
            ->find($id);
        if (is_null($hoaDon['ten_nguoi_dat_hang']) && is_null($hoaDon['so_dien_thoai_nguoi_dat_hang']) && is_null($hoaDon['dia_chi_nguoi_dat_hang'])) {
            $hoaDon['ten_nguoi_dat_hang'] = $hoaDon->user->ho . ' ' . $hoaDon->user->ten;
            $hoaDon['so_dien_thoai_nguoi_dat_hang'] = $hoaDon->user->so_dien_thoai;
            $hoaDon['dia_chi_nguoi_dat_hang'] = $hoaDon->user->dia_chi;
        }
        if ($hoaDon) {
            $pdf = Pdf::loadView('hoadon.bill', compact('hoaDon', 'thongTinWeb'));
            return $pdf->download('Hoadon' . $id . '.pdf');
        }
        return response()->json([
            'status' => false,
            'status_code' => 404,
            'message' => 'Đã xảy ra lỗi khi in hóa đơn',
        ], 404);
    }

    public function layThongTinDon()
    {
        try {
            // Kiểm tra số lượng đơn hàng theo trạng thái
            $donChoXacNhan = DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXH)->count();
            $tongTienDonChoXacNhan = (int) DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXH)->sum('tong_tien_don_hang') ?? 0;

            // Kiểm tra số lượng đơn hàng theo trạng thái thanh toán
            $donChoThanhToan = DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_CTT)->count();
            $tongTienChuaTT = (int) DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_CTT)->sum('tong_tien_don_hang') ?? 0;

            // Kiểm tra các trạng thái đơn hàng khác
            $donChuaGiaoHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_DXL)->count();
            $tongTienDonChuaGiao = (int) DonHang::where('trang_thai_don_hang', DonHang::TTDH_DXL)->sum('tong_tien_don_hang') ?? 0;

            $donHoanHang = DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)->count();
            $tongTienHoan = (int) DonHang::where('trang_thai_don_hang', DonHang::TTDH_HH)->sum('tong_tien_don_hang') ?? 0;

            $daThanhToan = DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_DTT)->count();
            $tongTienThanhToan = (int) DonHang::where('trang_thai_thanh_toan', DonHang::TTTT_DTT)->sum('tong_tien_don_hang') ?? 0;

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'choXacNhan' => [
                    'tong_don_cho_xac_nhan' => $donChoXacNhan,
                    'tong_tien' => $tongTienDonChoXacNhan
                ],
                'choThanhToan' => [
                    'tong_don_cho_thanh_toan' => $donChoThanhToan,
                    'tong_tien' => $tongTienChuaTT
                ],
                'chuaGiaoHang' => [
                    'tong_don_chua_giao_hang' => $donChuaGiaoHang,
                    'tong_tien' => $tongTienDonChuaGiao
                ],
                'donHoanHang' => [
                    'tong_don_hoan_hang' => $donHoanHang,
                    'tong_tien' => $tongTienHoan
                ],
                'donDaThanhToan' => [
                    'tong_don_da_thanh_toan' => $daThanhToan,
                    'tong_tien' => $tongTienThanhToan
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function hoanHang()
    {
        try {
            $donHangs = HoanTien::query()
                ->with('donHang', 'giaoDichVi')
                ->orderByDesc('id')
                ->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $donHangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function xacNhanHoanHang(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'trang_thai' => 'required|string|in:hoan_thanh_cong,tu_choi'
            ]);

            DB::beginTransaction();
            $hoanTien = HoanTien::findOrFail($id);
            $donHang = $hoanTien->donHang;
            $giaoDichVi = $hoanTien->giaoDichVi;
            $soDuTruoc = $giaoDichVi->viTien->so_du;
            $shippers = User::query()->with('vaiTros')->whereHas('vaiTros', function ($query) {
                $query->where('ten_vai_tro', 'Người giao hàng');
            })->get();

            if ($validated['trang_thai'] === 'hoan_thanh_cong') {
                // $hoanTien->update(['trang_thai' => 'hoan_thanh_cong']);
                // $giaoDichVi->update(['trang_thai' => 'thanh_cong']);

                // $donHang->update(['trang_thai_don_hang' => DonHang::TTDH_HH]);
                // //Lưu giao dịch
                // DB::table('lich_su_giao_diches')->insert([
                //     'vi_tien_id' => $giaoDichVi->viTien->id,
                //     'so_du_truoc' => $soDuTruoc,
                //     'so_du_sau' => $soDuTruoc + $hoanTien->so_tien_hoan,
                //     'ngay_thay_doi' => Carbon::now(),
                //     'mo_ta' => 'Hoàn tiền đơn hàng #' . $hoanTien->donHang->ma_don_hang,
                // ]);
                // $giaoDichVi->viTien->increment('so_du', $hoanTien->so_tien_hoan);
                $minDonHangCount = $shippers->min(fn($shipper) => $shipper->vanChuyens->count());
                $shippersWithMinDonHang = $shippers->filter(fn($shipper) => $shipper->vanChuyens->count() == $minDonHangCount);
                $shipper = $shippersWithMinDonHang->random();
                $hoanHang = Hoan_hang::create([
                    'don_hang_id' => $donHang->id,
                    'user_id' => $donHang->user_id,
                    'shipper_id' => $shipper->id,
                    'ngay_tao' => Carbon::now(),
                    'hoan_tien_id' => $id,
                ]);
                // dd($hoanHang);
                // Gửi thông báo hoàn hàng qua Telegram
                $thongBaoHoanHang = new ThongBaoTelegramController();
                $thongBaoHoanHang->thongBaoHoanHang($hoanHang);
                $donHang->update(['ngay_hoan' => Carbon::now()]);

                $mess = 'Xác nhận hoàn hàng thành công.';
            } else if ($validated['trang_thai'] === 'tu_choi') {
                $hoanTien->update(['trang_thai' => 'tu_choi']);
                $giaoDichVi->update(['trang_thai' => 'that_bai']);

                $donHang->update([
                    'trang_thai_don_hang' => DonHang::TTDH_TCHH,
                    'ngay_hoan' => null
                ]);
                //Lưu giao dịch
                DB::table('lich_su_giao_diches')->insert([
                    'vi_tien_id' => $giaoDichVi->viTien->id,
                    'so_du_truoc' => $soDuTruoc,
                    'so_du_sau' => $giaoDichVi->viTien->so_du,
                    'ngay_thay_doi' => Carbon::now(),
                    'mo_ta' => 'Từ chối hoàn tiền đơn hàng #' . $hoanTien->donHang->ma_don_hang,
                ]);
                $giaoDichVi->update(['trang_thai' => 'that_bai']);
                $mess = 'Từ chối hoàn hàng thành công.';
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => $mess,
                'data' => $hoanTien
            ], status: 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi xác nhận hoàn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function danhSachChoXacNhanHuyHang()
    {
        try {
            $donHangs = DonHang::where('trang_thai_don_hang', DonHang::TTDH_CXNDH)->orderByDesc('id')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $donHangs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function xacNhanHuyHang(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'trang_thai' => 'required|string|in:da_huy,tu_choi',
                'ly_do_tu_choi' => 'required_if:trang_thai,tu_choi'
            ]);

            DB::beginTransaction();
            $donHang = DonHang::findOrFail($id);

            if ($validated['trang_thai'] === 'da_huy') {
                $donHang->update(['trang_thai_don_hang' => DonHang::TTDH_DH]);
                $donHang->chiTiets->each(function ($chiTiet) {
                    $chiTiet->bienTheSanPham->increment('so_luong_bien_the', $chiTiet->so_luong);
                });
                $mess = 'Xác nhận hủy hàng thành công.';
            } else if ($validated['trang_thai'] === 'tu_choi') {
                $donHang->update(['trang_thai_don_hang' => DonHang::TTDH_TCHH]);
                $thongbao = ThongBao::create([
                    'user_id' => $donHang->user_id,
                    'tieu_de' => 'Yêu cầu hủy hàng của bạn đã bị từ chối',
                    'noi_dung' => 'Yêu cầu hủy hàng của bạn đã bị từ chối. Vui lòng liên hệ với cửa hàng',
                    'loai' => 'Yêu cầu rút tiền',
                    'duong_dan' => 'yeu-cau-rut-tien',
                    'id_duong_dan' => $donHang->id,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);
                $mess = 'Từ chối hủy hàng thành công.';
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => $mess,
                'data' => $donHang
            ], status: 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi xác nhận hủy hàng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function danhSachYeuCauRutTien()
    {
        try {
            $yeuCauRutTiens = YeuCauRutTien::with('viTien.user')->orderByDesc('id')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => $yeuCauRutTiens
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách yêu cầu rút tiền.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function xacNhanYeuCauRutTien(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'trang_thai' => 'required|string|in:da_rut,that_bai'
            ]);

            DB::beginTransaction();
            $yeuCauRutTien = YeuCauRutTien::with('nganHang')->findOrFail($id);

            if ($validated['trang_thai'] === 'da_rut') {
                $yeuCauRutTien->update(['trang_thai' => 'da_rut']);
                //Lưu giao dịch
                DB::table('lich_su_giao_diches')->insert([
                    'vi_tien_id' => $yeuCauRutTien->vi_tien_id,
                    'so_du_truoc' => $yeuCauRutTien->viTien->so_du,
                    'so_du_sau' => $yeuCauRutTien->viTien->so_du - $yeuCauRutTien->so_tien,
                    'ngay_thay_doi' => Carbon::now(),
                    'mo_ta' => 'Rút tiền từ ví',
                ]);
                $thongbao = ThongBao::create([
                    'user_id' => $yeuCauRutTien->viTien->user_id,
                    'tieu_de' => 'Yêu cầu rút tiền của bạn đã được xác nhận',
                    'noi_dung' => 'Yêu cầu rút tiền từ ví của bạn đã được xác nhận. Vui lòng kiểm tra lại tài khoản ngân hàng của bạn.',
                    'loai' => 'Yêu cầu rút tiền',
                    'duong_dan' => 'yeu-cau-rut-tien',
                    'id_duong_dan' => $yeuCauRutTien->id,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);

                broadcast(new ThongBaoMoi($thongbao))->toOthers();
                $mess = 'Xác nhận yêu cầu rút tiền thành công.';
            } else if ($validated['trang_thai'] === 'that_bai') {
                $yeuCauRutTien->update(['trang_thai' => 'that_bai']);
                //Lưu giao dịch
                DB::table('lich_su_giao_diches')->insert([
                    'vi_tien_id' => $yeuCauRutTien->vi_tien_id,
                    'so_du_truoc' => $yeuCauRutTien->viTien->so_du,
                    'so_du_sau' => $yeuCauRutTien->viTien->so_du,
                    'ngay_thay_doi' => Carbon::now(),
                    'mo_ta' => 'Từ chối yêu cầu rút tiền',
                ]);
                $yeuCauRutTien->viTien->increment('so_du', $yeuCauRutTien->so_tien);
                $thongbao = ThongBao::create([
                    'user_id' => $yeuCauRutTien->viTien->user_id,
                    'tieu_de' => 'Yêu cầu rút tiền của bạn đã bị từ chối',
                    'noi_dung' => 'Yêu cầu rút tiền từ ví của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin và thử lại.',
                    'loai' => 'Yêu cầu rút tiền',
                    'duong_dan' => 'yeu-cau-rut-tien',
                    'id_duong_dan' => $yeuCauRutTien->id,
                    'hinh_thu_nho' => 'https://e1.pngegg.com/pngimages/542/837/png-clipart-icone-de-commande-bon-de-commande-bon-de-commande-bon-de-travail-systeme-de-gestion-des-commandes-achats-inventaire-conception-d-icones.png',
                ]);

                broadcast(new ThongBaoMoi($thongbao))->toOthers();
                $mess = 'Từ chối yêu cầu rút tiền thật bại.';
            }
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => $mess,
                'data' => $yeuCauRutTien
            ], status: 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã xảy ra lỗi khi xác nhận yêu cầu rút tiền.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}