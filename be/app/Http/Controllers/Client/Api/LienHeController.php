<?php

namespace App\Http\Controllers\Client\Api;

use App\Events\SendMail;
use App\Http\Controllers\Controller;
use App\Models\LienHe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LienHeController extends Controller
{

    public function lienHe(Request $request)
    {
        try {
            $validateLienHe = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'noi_dung_lien_he' => 'required',
                'sdt_lien_he' => 'nullable|string|max:20',
                'loai_lien_he' => 'nullable|string',
                'trang_thai_lien_he' => 'nullable|string',
            ]);


            if (Auth::check()) {
                $validateLienHe['user_id'] = Auth::id();
            } else {
                return response()->json([
                    'status' => false,
                    'status_code' => 401,
                    'message' => 'Không thể gửi liên hệ',
                    'data' => Auth::check()
                ], 401);
            }

            $lienhe = LienHe::create($validateLienHe);
            event(new SendMail( $lienhe->email, $lienhe->name, 'contact'));
            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Gửi liên hệ thành công',
                'data' => $lienhe
            ]);
        } catch (\Exception $exception) {

            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi gửi liên hệ',
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
