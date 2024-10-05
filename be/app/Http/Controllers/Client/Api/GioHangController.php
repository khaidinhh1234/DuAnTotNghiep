<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\GioHang;
use App\Models\BienTheSanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GioHangController extends Controller
{
    public function index()
    {
        $gioHangs = GioHang::where('user_id', Auth::id())->get();
        return response()->json($gioHangs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'bien_the_san_pham_id' => 'required|exists:bien_the_san_phams,id',
            'so_luong' => 'required|integer|min:1',
        ]);

        $bienTheSanPham = BienTheSanPham::findOrFail($request->bien_the_san_pham_id);

        if ($request->so_luong > $bienTheSanPham->so_luong_bien_the) {
            return response()->json([
                'message' => 'Số lượng sản phẩm vượt quá số lượng tồn kho.'
            ], 400);
        }

        $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia;

        $gioHang = GioHang::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'bien_the_san_pham_id' => $request->bien_the_san_pham_id,
            ],
            [
                'so_luong' => $request->so_luong,
                'gia' => $gia,
                'thanh_tien' => $gia * $request->so_luong,
            ]
        );

        return response()->json($gioHang, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'so_luong' => 'required|integer|min:1',
        ]);

        $gioHang = GioHang::findOrFail($id);

        if ($gioHang->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bienTheSanPham = BienTheSanPham::findOrFail($gioHang->bien_the_san_pham_id);

        if ($request->so_luong > $bienTheSanPham->so_luong_bien_the) {
            return response()->json([
                'message' => 'Số lượng sản phẩm vượt quá số lượng tồn kho.'
            ], 400);
        }

        $gia = $bienTheSanPham->gia_khuyen_mai_tam_thoi ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia;

        $gioHang->update([
            'so_luong' => $request->so_luong,
            'thanh_tien' => $gia * $request->so_luong,
        ]);

        return response()->json($gioHang);
    }

    public function destroy($id)
    {
        $gioHang = GioHang::findOrFail($id);

        if ($gioHang->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gioHang->delete();

        return response()->json(['message' => 'Sản phẩm đã xóa khỏi giỏ hàng']);
    }
}
