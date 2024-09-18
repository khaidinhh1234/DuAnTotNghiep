<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Mews\Captcha\Facades\Captcha;

class CaptchaController extends Controller
{
    /**
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCaptcha()
    {
        $captcha = Captcha::create();

        if ($captcha instanceof Response) {
            return $captcha;
        }

        return response()->json([
            'captcha_key' => $captcha['key'],
            'captcha_image' => $captcha['img']
        ]);
    }

    /**
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateCaptcha(Request $request)
    {
        $validatedData = $request->validate([
            'captcha_key' => 'required|string',
            'captcha_value' => 'required|string'
        ]);

        $captchaKey = $validatedData['captcha_key'];
        $captchaValue = $validatedData['captcha_value'];

        if (Captcha::check_api($captchaValue, $captchaKey)) {
            return response()->json(['message' => 'Captcha hợp lệ'], 200);
        } else {
            return response()->json(['message' => 'Captcha không hợp lệ'], 422);
        }
    }
}
