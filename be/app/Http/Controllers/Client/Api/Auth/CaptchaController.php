<?php

namespace App\Http\Controllers\Client\Api\Auth;

use App\Http\Controllers\Controller;
use Gregwar\Captcha\CaptchaBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CaptchaController extends Controller
{
    public function generateCaptcha()
    {
        $builder = new CaptchaBuilder();
        $builder->build();

        // Lưu mã CAPTCHA vào cache với thời gian hết hạn (5 phút)
        $captchaPhrase = $builder->getPhrase();
        Cache::put('captcha', $captchaPhrase, 300); // 300 giây = 5 phút

        // Trả về hình ảnh CAPTCHA dưới dạng response
        return response($builder->output())->header('Content-Type', 'image/jpeg');
    }

    public function verifyCaptcha(Request $request)
    {
        $captcha = Cache::get('captcha');

        // So sánh mã CAPTCHA với input của người dùng
        if ($request->input('captcha') === $captcha) {
            // Xóa CAPTCHA sau khi xác thực thành công
            Cache::forget('captcha');
            return response()->json(['message' => 'CAPTCHA hợp lệ'], 200);
        }

        return response()->json(['message' => 'CAPTCHA không hợp lệ'], 422);
    }
}
