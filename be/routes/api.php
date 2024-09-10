<?php

use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\Auth\ResetPasswordController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\DanhMucController;
use App\Models\DanhMuc;
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
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// Danh muc
Route::apiResource('danhmuc', DanhMucController::class);

// Sản phẩm
Route::get('sanpham/thung-rac', [App\Http\Controllers\Admin\Api\SanPhamController::class, 'danhSachSanPhamDaXoa'])->name('sanpham.thungrac');
Route::post('sanpham/thung-rac/{id}', [App\Http\Controllers\Admin\Api\SanPhamController::class, 'khoiPhucSanPham'])->name('sanpham.khoiphuc');
Route::apiResource('sanpham', App\Http\Controllers\Admin\Api\SanPhamController::class);
