<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\ThongBao;
use Illuminate\Support\Facades\Auth;

class ThongBaoController extends Controller
{
    public function index()
    {
        try {
            $data = ThongBao::query()->where('user_id', Auth::user()->id)->orderByDesc('id')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    public function daXem($id)
    {

    }
}
