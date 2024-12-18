<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\SendMail;
use App\Http\Controllers\Controller;
use App\Models\LienHe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrangLienHeController extends Controller
{

    public function lienHe(Request $request)
    {
        try {
            DB::beginTransaction();
            $validateLienHe = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'noi_dung_lien_he' => 'required',
                'sdt_lien_he' => 'nullable|string|max:20',
                'loai_lien_he' => 'nullable|string',
                'trang_thai_lien_he' => 'nullable|string',
                'noi_dung_phan_hoi' => 'nullable|string',
            ]);


            $validateLienHe['user_id'] = Auth::guard('api')->check() ? Auth::guard('api')->id() : 0;

            $lienhe = LienHe::create($validateLienHe);

            event(new SendMail( $lienhe->email, $lienhe->name, 'contact', $validateLienHe['noi_dung_lien_he']));
            DB::commit();
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Gửi liên hệ thành công',
                'data' => $lienhe
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi gửi liên hệ',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
