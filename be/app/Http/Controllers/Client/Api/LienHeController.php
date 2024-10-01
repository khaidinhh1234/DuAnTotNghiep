<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactEmail;
use App\Models\LienHe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class LienHeController extends Controller
{

    public function lienHe(Request $request)
    {
        try {
            $validateLienHe = $request->validate([
                'ten_lien_he' => 'required|string|max:255',
                'email_lien_he' => 'required|email|max:255',
                'noi_dung_lien_he' => 'required',
                'sdt_lien_he' => 'nullable|string|max:20',
                'loai_lien_he' => 'nullable|string',
                'trang_thai_lien_he' => 'nullable|string',
                'nguoi_phu_trach_id' => 'nullable|integer'
            ]);

            $lienhe = LienHe::create([
                'tai_khoan_lien_he_id' => auth()->id(),
                'ten_lien_he' => $request->ten_lien_he,
                'sdt_lien_he' => $request->sdt_lien_he,
                'email_lien_he' => $request->email_lien_he,
                'noi_dung_lien_he' => $request->noi_dung_lien_he,
                'loai_lien_he' => $request->loai_lien_he,
                'trang_thai_lien_he' => $request->trang_thai_lien_he,
                'nguoi_phu_trach_id' => $request->nguoi_phu_trach_id,
            ]);
            Mail::to('chiduc1611@gmail.com')->send(new ContactEmail($lienhe));

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Gửi liên hệ thành công',
                'data' => $validateLienHe
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
