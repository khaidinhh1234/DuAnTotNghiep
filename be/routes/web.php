<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


// Route cho quên mật khẩu
// Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

// Route cho đặt lại mật khẩu
// Route::post('reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// // Hiển thị form đặt lại mật khẩu (tùy chọn nếu sử dụng trên frontend)
// Route::get('reset-password/{token}', function ($token) {
//     return view('auth.passwords.reset', ['token' => $token]);
// })->name('password.reset');

Route::get('/test-email', function () {
    Mail::raw('This is a test email', function ($message) {
        $message->to('chiduc1611@gmail.com') // thay bằng email của bạn
            ->subject('Test Email');
    });

    return 'Email sent';
});
