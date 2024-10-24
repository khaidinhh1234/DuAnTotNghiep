<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\HoanTatDonHang;
use App\Events\SendMail;
use App\Events\ThongBaoMoi;
use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\GioHang;
use App\Models\MaKhuyenMai;
use App\Models\ThongBao;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;


class DonHangClientController extends Controller
{
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }

    public function thanhToanMomo(Request $request)
    {
        $endpoint = env('MOMO_TEST_ENDPOINT');

        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');
        $orderInfo = "Thanh toán qua MoMo";
        $amount = "10000";
        $orderId = 123;
        $redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        $ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        $extraData = "";

        $requestId = time() . "";
        $requestType = "payWithATM";
        // $extraData = ($_POST["extraData"] ? $_POST["extraData"] : "");
        //before sign HMAC SHA256 signature
        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);
        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Test",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );
        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);  // decode json


        return redirect()->to($jsonResult['payUrl']);
    }
    public function donHangUser()
    {
        try {
            $user = Auth::guard('api')->user();
            $donHang = DonHang::where('user_id', $user->id)->with([
                'chiTiets.bienTheSanPham.sanPham', // Lấy sản phẩm từ biến thể
                'chiTiets.bienTheSanPham.mauBienThe', // Lấy màu biến thể
                'chiTiets.bienTheSanPham.kichThuocBienThe', // Lấy kích thước biến thể
                'chiTiets.bienTheSanPham.anhBienThe', // Lấy ảnh biến thể
                'danhGias.user', // Lấy đánh giá của đơn hàng
                'vanChuyen',
            ])
                ->orderByDesc('created_at')->get();

            // Tính toán tổng số lượng và tổng tiền

            $donHang->map(function ($item) {
                $item['tong_tien_da_giam'] = $item['tong_tien_don_hang'] - $item['so_tien_giam_gia'];
                $item['tongSoLuong'] = $item->chiTiets->sum('so_luong');
                $item['tongTienSanPham'] = $item->chiTiets->sum('thanh_tien');
            });

            // Chuẩn bị dữ liệu đơn hàng chi tiết với tên sản phẩm, ảnh, số lượng và giá
            $chiTietDonHang = $donHang->flatMap(function ($order) {
                return $order->chiTiets->map(function ($chiTiet) {
                    // Lấy các đường dẫn ảnh biến thể từ bảng anh_bien_thes
                    $anhBienThe = $chiTiet->bienTheSanPham->anhBienThe->pluck('duong_dan_anh')->toArray();

                    // Lấy ảnh sản phẩm (giả sử có một trường duong_dan_anh trong bảng san_phams)
                    $anhSanPham = $chiTiet->bienTheSanPham->sanPham->duong_dan_anh;

                    $gia_giam = $chiTiet->bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $chiTiet->bienTheSanPham->gia_khuyen_mai ?? $chiTiet->bienTheSanPham->gia_ban;
                    return [
                        'ten_san_pham' => $chiTiet->bienTheSanPham->sanPham->ten_san_pham,
                        'anh_san_pham' => $anhSanPham, // Ảnh sản phẩm
                        'anh_bien_the' => $anhBienThe, // Ảnh biến thể
                        'mau_bien_the' => $chiTiet->bienTheSanPham->mauBienThe->ten_mau_sac,
                        'kich_thuoc_bien_the' => $chiTiet->bienTheSanPham->kichThuocBienThe->kich_thuoc,
                        'so_luong' => $chiTiet->so_luong,
                        'gia_giam' => $gia_giam,
                        'gia' => $chiTiet->gia,
                        'thanh_tien' => $gia_giam * $chiTiet->so_luong ,
                    ];
                });
            });

            // Lấy đánh giá của đơn hàng
            $danhGiaDonHang = $donHang->flatMap(function ($order) {
                return $order->danhGias;
            });
            $danhGiaData = null;
            if ($danhGiaDonHang->isNotEmpty()) {
                $danhGiaData = $danhGiaDonHang->map(function ($danhGia) {
                    return [
                        'so_sao_san_pham' => $danhGia->so_sao_san_pham,
                        'so_sao_dich_vu_van_chuyen' => $danhGia->so_sao_dich_vu_van_chuyen,
                        'chat_luong_san_pham' => $danhGia->chat_luong_san_pham,
                        'mo_ta' => $danhGia->mo_ta,
                        'phan_hoi' => $danhGia->phan_hoi,
                        'huu_ich' => $danhGia->huu_ich
                    ];
                });
            }

            //Thong tin user
            $thongTin = $donHang->map(function ($order) {
                if (
                    $order->ten_nguoi_dat_hang == ""
                    && $order->so_dien_thoai_nguoi_dat_hang == ""
                    && $order->dia_chi_nguoi_dat_hang == ""
                ) {
                    return $order->user;
                } else {
                    return [
                        'ten_nguoi_dat_hang' => $order->ten_nguoi_dat_hang === "" ? ($order->user->ho . " " . $order->user->ten) : $order->ten_nguoi_dat_hang,
                        'so_dien_thoai_nguoi_dat_hang' => $order->so_dien_thoai_nguoi_dat_hang === "" ? $order->user->so_dien_thoai : $order->so_dien_thoai_nguoi_dat_hang,
                        'dia_chi_nguoi_dat_hang' => $order->dia_chi_nguoi_dat_hang === "" ? $order->user->dia_chi : $order->dia_chi_nguoi_dat_hang
                    ];
                }
            });

            // Chuẩn bị phản hồi với đầy đủ thông tin
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'data' => [
                    'thong_tin' => $thongTin,
                    'don_hang' => $donHang,
                    'chi_tiet_cua_don_hang' => $chiTietDonHang,
                    'danh_gia' => $danhGiaData // Thông tin đánh giá
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => '',
                'error' => $e->getMessage()
            ]);
        }
    }
    public function donHangUserDetail(string $maDonHang)
    {
        try {
            $donHang = DonHang::query()->with([
                'chiTiets.bienTheSanPham.mauBienThe',
                'chiTiets.bienTheSanPham.kichThuocBienThe',
                'user.hangThanhVien',
                'vanChuyen',
                'bienTheSanPhams',
                'danhGias'
            ])->where('ma_don_hang', $maDonHang)->first();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy chi tiết đơn hàng',
                'data' => $donHang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Lấy chi tiết đơn hàng thất bại',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function xacNhanDonHang(string $id)
    {
        try {
            DB::beginTransaction();
            $donHang = DonHang::query()->with('vanChuyen')->findOrFail($id);

            if ($donHang->vanChuyen->shipper_xac_nhan == 1) {
                $donHang->vanChuyen->update([
                    'khach_hang_xac_nhan' => 1
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 400,
                    'message' => 'Đơn hàng chưa được xác nhận đã giao hàng',
                ]);
            }

            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Xác nhận nhận hàng thành công',
                'data' => $donHang
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Xác nhận nhận hàng thất bại',
                'error' => $e->getMessage()
            ]);
        }
    }



    public function taoDonHang(Request $request)
    {
        try {
            DB::beginTransaction();

            $userId = Auth::id();

            $sanPhamDuocChon = DB::table('gio_hangs')
                ->join('bien_the_san_phams', 'gio_hangs.bien_the_san_pham_id', '=', 'bien_the_san_phams.id')
                ->where('gio_hangs.user_id', $userId)
                ->where('gio_hangs.chon', 1)
                ->where("gio_hangs.deleted_at", null)
                ->select('bien_the_san_phams.id as bien_the_san_pham_id', 'gio_hangs.so_luong')
                ->get();

            if ($sanPhamDuocChon->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn chưa chọn sản phẩm nào để mua.',
                ], 400);
            }

            $tongTienDonHang = 0;
            $soTienGiamGia = 0;

            foreach ($sanPhamDuocChon as $sanPham) {
                $bienTheSanPham = BienTheSanPham::findOrFail($sanPham->bien_the_san_pham_id);
                if ($sanPham->so_luong > $bienTheSanPham->so_luong_bien_the) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Số lượng sản phẩm không hợp lệ.',
                    ], 400);
                }

                $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;

                $tongTienDonHang += $gia * $sanPham->so_luong;
            }

            if (!empty($request->ma_giam_gia)) {
                $maGiamGia = MaKhuyenMai::where('ma_code', $request->ma_giam_gia)->first();
                if ($maGiamGia) {
                    if ($maGiamGia->loai === 'phan_tram') {
                        $soTienGiamGia = $tongTienDonHang * ($maGiamGia->giam_gia / 100);
                    } else {
                        $soTienGiamGia = $maGiamGia->giam_gia;
                    }
                }
            }

            $maDonHang = 'DH' . strtoupper(uniqid());
            $donHang = DonHang::create([
                'ma_don_hang' => $maDonHang,
                'user_id' => $userId,
                'ghi_chu' => $request->ghi_chu ?? null,
                'trang_thai_don_hang' => DonHang::TTDH_CXH,
                'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                'tong_tien_don_hang' => $tongTienDonHang - $soTienGiamGia,
                'ten_nguoi_dat_hang' => $request->ten_nguoi_dat_hang,
                'so_dien_thoai_nguoi_dat_hang' => $request->so_dien_thoai_nguoi_dat_hang,
                'email_nguoi_dat_hang' => $request->email_nguoi_dat_hang,
                'dia_chi_nguoi_dat_hang' => $request->dia_chi_nguoi_dat_hang,
                'ma_giam_gia' => $request->ma_giam_gia ?? null,
                'so_tien_giam_gia' => $soTienGiamGia,
                'trang_thai_thanh_toan' => DonHang::TTTT_CTT,
            ]);

            foreach ($sanPhamDuocChon as $sanPham) {
                $bienTheSanPham = BienTheSanPham::findOrFail($sanPham->bien_the_san_pham_id);
                $soLuongMua = $sanPham->so_luong;

                $bienTheSanPham->so_luong_bien_the -= $soLuongMua;
                $bienTheSanPham->save();

                $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_ban;

                DonHangChiTiet::create([
                    'don_hang_id' => $donHang->id,
                    'bien_the_san_pham_id' => $bienTheSanPham->id,
                    'so_luong' => $soLuongMua,
                    'gia' => $gia,
                    'thanh_tien' => $gia * $soLuongMua,
                ]);
            }


            $donHang = DonHang::with(['chiTietDonHangs'])
                ->where('id', $donHang->id)
                ->first();

            DB::table('gio_hangs')
                ->where('user_id', $userId)
                ->where('chon', 1)
                ->update(['deleted_at' => now()]);

            //            event(new HoanTatDonHang($donHang, $request->email_nguoi_dat_hang));


            $thongBao = ThongBao::create([
                'user_id' => $userId,
                'tieu_de' => 'Đơn hàng đã được đặt',
                'noi_dung' => 'Đơn hàng đã được đặt',
                'loai' => 'Đơn hàng',
                'duong_dan' => 'don-hang',
                'loai_duong_dan' => 'don-hang',
                'id_duong_dan' => $donHang->id,
            ]);

            broadcast(new ThongBaoMoi($thongBao))->toOthers();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Đơn hàng đã được tạo thành công!',
                'data' => $donHang
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
}
