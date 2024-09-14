<?php

use App\Http\Controllers\Admin\Api\DanhMucController;
use App\Http\Controllers\Admin\Api\DanhMucTinTucController;
use App\Http\Controllers\Admin\Api\SanPhamController;
use App\Http\Controllers\Admin\Api\TheController;
use App\Http\Controllers\Admin\Api\VaiTroController;
use App\Http\Controllers\Admin\Api\ThongTinWebController;
use App\Http\Controllers\Admin\Api\TinTucController;
use App\Http\Controllers\Client\Api\Auth\AuthController;
use App\Http\Controllers\Client\Api\Auth\ChangePasswordController;
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
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/change-password', [ChangePasswordController::class, 'changePassword'])->middleware('auth:sanctum');

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

// Danh muc
Route::get('danhmuc/thung-rac', [DanhMucController::class, 'danhSachDanhMucDaXoa']);
Route::post('danhmuc/thung-rac/{id}', [DanhMucController::class, 'khoiPhucDanhMuc']);
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

//Danh Mục Tin Tức
Route::get('danhmuctintuc/thung-rac', [DanhMucTinTucController::class, 'danhSachDanhMucTinTucDaXoa']);
Route::post('danhmuctintuc/thung-rac/{id}', [DanhMucTinTucController::class, 'khoiPhucTinTuc']);
Route::apiResource('danhmuctintuc', DanhMucTinTucController::class);

//Tin Tức
Route::get('tintuc/thung-rac', [TinTucController::class, 'danhSachTinTucDaXoa']);
Route::post('tintuc/thung-rac/{id}', [TinTucController::class, 'khoiPhucTinTuc']);
Route::apiResource('tintuc', TinTucController::class);

// Mã khuyến mãi
Route::apiResource('makhuyenmai', App\Http\Controllers\Admin\Api\MaKhuyenMaiController::class);
