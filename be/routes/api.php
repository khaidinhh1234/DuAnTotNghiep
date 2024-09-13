<?php

use App\Http\Controllers\Admin\Api\DanhMucController;
use App\Http\Controllers\Admin\Api\SanPhamController;
use App\Http\Controllers\Admin\Api\TheController;
use App\Http\Controllers\Admin\Api\VaiTroController;
use App\Http\Controllers\Admin\Api\ThongTinWebController;
use App\Http\Controllers\Client\Api\Auth\AuthController;
use App\Http\Controllers\Client\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Client\Api\Auth\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

// Danh muc
Route::apiResource('danhmuc', DanhMucController::class);

// Sản phẩm
Route::get('sanpham/thung-rac', [SanPhamController::class, 'danhSachSanPhamDaXoa']);
Route::post('sanpham/thung-rac/{id}', [SanPhamController::class, 'khoiPhucSanPham']);
Route::apiResource('sanpham', SanPhamController::class);

// Thẻ
Route::get('the/thung-rac', [TheController::class, 'danhSachTheDaXoa']);
Route::post('the/thung-rac/{id}', [TheController::class, 'khoiPhucThe']);
Route::apiResource('the', TheController::class);


//Vai trò
Route::get('vaitro/thung-rac', [VaiTroController::class, 'danhSachVaiTroDaXoa']);
Route::post('vaitro/thung-rac/{id}', [VaiTroController::class, 'khoiPhucVaiTro']);
Route::apiResource('vaitro', VaiTroController::class);

// Thông tin website
Route::get('thong-tin-web', [ThongTinWebController::class, 'index']);
Route::post('thong-tin-web', [ThongTinWebController::class, 'storeOrUpdate']);
