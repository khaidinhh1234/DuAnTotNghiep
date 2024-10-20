<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\GioHang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

        //Just a example, please check more in there

        return redirect()->to($jsonResult['payUrl']);
    }

    public function donHangUser()
    {
        try {
            $user = Auth::guard('api')->user();
            $donHang = DonHang::where('user_id', $user->id)->orderByDesc('created_at')->get();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $donHang
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => '',
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
            $request->validate([
                'san_pham_chon' => 'required|array',
                'san_pham_chon.*.bien_the_san_pham_id' => 'required|exists:bien_the_san_phams,id',
                'san_pham_chon.*.so_luong' => 'required|integer|min:1',
                'ten_nguoi_dat_hang' => 'required|string|max:255',
                'so_dien_thoai_nguoi_dat_hang' => 'required|string|max:15',
                'email_nguoi_dat_hang' => 'required|email|max:255',
                'dia_chi_nguoi_dat_hang' => 'required|string|max:255',
                'phuong_thuc_thanh_toan' => 'required|in:' . implode(',', [DonHang::PTTT_TT, DonHang::PTTT_NH, DonHang::PTTT_MM]),
            ]);

            DB::beginTransaction();

            $sanPhamDuocChon = $request->san_pham_chon;

            if (empty($sanPhamDuocChon)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn chưa chọn sản phẩm nào để mua.',
                ], 400);
            }

            $tongTienDonHang = 0;

            foreach ($sanPhamDuocChon as $sanPham) {
                $bienTheSanPham = BienTheSanPham::findOrFail($sanPham['bien_the_san_pham_id']);
                if ($sanPham['so_luong'] > $bienTheSanPham->so_luong_bien_the) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Số lượng sản phẩm không hợp lệ.',
                    ], 400);
                }

                $tongTienDonHang += $bienTheSanPham->gia * $sanPham['so_luong'];
            }

            $maDonHang = 'DH' . strtoupper(uniqid());

            $userId = null;

            if (Auth::check()) {
                $userId = Auth::id();
            } else {
                $existingUser = User::where('email', $request->email_nguoi_dat_hang)->first();

                if ($existingUser) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Email đã tồn tại. Vui lòng đăng nhập để thực hiện đơn hàng.',
                    ], 400);
                } else {
                    $user = User::create([
                        'ten' => $request->ten_nguoi_dat_hang,
                        'ho' => $request->ten_nguoi_dat_hang,
                        'email' => $request->email_nguoi_dat_hang,
                        'an_danh' => 1,
                    ]);

                    $userId = $user->id;
                }
            }

            $donHang = DonHang::create([
                'ma_don_hang' => $maDonHang,
                'user_id' => $userId,
                'ghi_chu' => $request->ghi_chu,
                'trang_thai_don_hang' => DonHang::TTDH_CXH,
                'phuong_thuc_thanh_toan' => $request->phuong_thuc_thanh_toan,
                'tong_tien_don_hang' => $tongTienDonHang,
                'ten_nguoi_dat_hang' => $request->ten_nguoi_dat_hang,
                'so_dien_thoai_nguoi_dat_hang' => $request->so_dien_thoai_nguoi_dat_hang,
                'dia_chi_nguoi_dat_hang' => $request->dia_chi_nguoi_dat_hang,
                'ma_giam_gia' => $request->ma_giam_gia,
                'so_tien_giam_gia' => $request->so_tien_giam_gia ?? 0,
                'trang_thai_thanh_toan' => DonHang::TTTT_CTT,
            ]);

            foreach ($sanPhamDuocChon as $sanPham) {
                $bienTheSanPham = BienTheSanPham::findOrFail($sanPham['bien_the_san_pham_id']);
                $soLuongMua = $sanPham['so_luong'];

                $bienTheSanPham->so_luong_bien_the -= $soLuongMua;
                $bienTheSanPham->save();

                $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai  ?? $bienTheSanPham->gia_ban;

                DonHangChiTiet::create([
                    'don_hang_id' => $donHang->id,
                    'bien_the_san_pham_id' => $bienTheSanPham->id,
                    'so_luong' => $soLuongMua,
                    'gia' => $gia,
                    'thanh_tien' => $gia * $soLuongMua,
                ]);
            }

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
