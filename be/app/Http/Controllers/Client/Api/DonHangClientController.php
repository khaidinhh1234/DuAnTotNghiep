<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheSanPham;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\GioHang;
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
            $sanPhamHopLe = [];

            foreach ($sanPhamDuocChon as $sanPham) {
                $gioHangItem = GioHang::where('user_id', Auth::id())
                    ->where('bien_the_san_pham_id', $sanPham['bien_the_san_pham_id'])
                    ->first();

                if (!$gioHangItem || $sanPham['so_luong'] > $gioHangItem->so_luong) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Số lượng sản phẩm không hợp lệ hoặc sản phẩm không có trong giỏ hàng.',
                    ], 400);
                }

                $sanPhamHopLe[] = [
                    'gio_hang_item' => $gioHangItem,
                    'so_luong' => $sanPham['so_luong']
                ];

                $tongTienDonHang += $gioHangItem->gia * $sanPham['so_luong'];
            }

            $maDonHang = 'DH' . strtoupper(uniqid());

            $donHang = DonHang::create([
                'ma_don_hang' => $maDonHang,
                'user_id' => Auth::id(),
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

            foreach ($sanPhamHopLe as $item) {
                $gioHangItem = $item['gio_hang_item'];
                $bienTheSanPham = BienTheSanPham::findOrFail($gioHangItem->bien_the_san_pham_id);
                $soLuongMua = $item['so_luong'];

                DonHangChiTiet::create([
                    'don_hang_id' => $donHang->id,
                    'bien_the_san_pham_id' => $bienTheSanPham->id,
                    'so_luong' => $soLuongMua,
                    'gia' => $gioHangItem->gia,
                    'thanh_tien' => $gioHangItem->gia * $soLuongMua,
                ]);

                $bienTheSanPham->so_luong_bien_the -= $soLuongMua;
                $bienTheSanPham->save();

                if ($soLuongMua == $gioHangItem->so_luong) {
                    $gioHangItem->delete();
                } else {
                    $gioHangItem->so_luong -= $soLuongMua;
                    $gioHangItem->save();
                }
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
