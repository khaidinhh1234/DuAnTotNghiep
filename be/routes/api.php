<?php

use App\Http\Controllers\Admin\Api\BienTheKichThuocController;
use App\Http\Controllers\Admin\Api\BienTheMauSacController;
use App\Http\Controllers\Admin\Api\DanhGiaController as ApiDanhGiaController;
use App\Http\Controllers\Admin\Api\DanhMucController;
use App\Http\Controllers\Admin\Api\MaKhuyenMaiController;
use App\Http\Controllers\Admin\Api\DanhMucTinTucController;
use App\Http\Controllers\Admin\Api\DonHangController;
use App\Http\Controllers\Admin\Api\HangThanhVienController;
use App\Http\Controllers\Admin\Api\SanPhamController;
use App\Http\Controllers\Admin\Api\TaiKhoanController;
use App\Http\Controllers\Admin\Api\TheController;
use App\Http\Controllers\Admin\Api\ThongKeDanhGiaController;
use App\Http\Controllers\Admin\API\ThongKeDoanhThuController;
use App\Http\Controllers\Admin\Api\VaiTroController;
use App\Http\Controllers\Admin\Api\ThongTinWebController;
use App\Http\Controllers\Admin\Api\TinTucController;
use App\Http\Controllers\Client\Api\Auth\AuthController;
use App\Http\Controllers\Client\Api\Auth\ChangePasswordController;
use App\Http\Controllers\Client\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Client\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Client\Api\CaptchaController;
use App\Http\Controllers\Client\Api\DanhGiaController;
use App\Models\VaiTro;
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
    // $users = $request->user()->vaiTros;
    // foreach ($users as $user) {
    //     $vaiTro = VaiTro::query()->where('ten_vai_tro', $user->ten_vai_tro)->with('quyens')->first();
    //     $tenQuyen = $vaiTro->quyens->pluck('ten_quyen');
    // }
    // return $tenQuyen;
})->name('user');

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/change-password', [ChangePasswordController::class, 'changePassword'])->middleware('auth:sanctum');

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/check-token-forgot', [ResetPasswordController::class, 'checkTokenForgot']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

// Captcha
Route::get('captcha', [CaptchaController::class, 'getCaptcha']);
Route::post('captcha/validate', [CaptchaController::class, 'validateCaptcha']);

// Đánh giá
Route::get('sanpham/{sanpham}/danhgia', [DanhGiaController::class, 'danhSachDanhGia']);
Route::post('danhgia', [DanhGiaController::class, 'themMoiDanhGia']);


//'auth:sanctum', 'auth.checkrole'
Route::middleware([])
    ->name('admin.')
    ->prefix('admin')
    ->group(function () {
        // Danh muc
        Route::apiResource('danhmuc', DanhMucController::class)->except(['show']);
        Route::get('danhmuc/thung-rac', [DanhMucController::class, 'danhSachDanhMucDaXoa'])->name('danhmuc.thungrac');
        Route::get('danhmuc/{id}', [DanhMucController::class, 'show'])->name('danhmuc.show');
        Route::post('danhmuc/thung-rac/{id}', [DanhMucController::class, 'khoiPhucDanhMuc'])->name('danhmuc.khoiphuc');
        Route::get('danhmuc/{id}', [DanhMucController::class, 'show'])->name('danhmuc.show');

        // Sản phẩm
        Route::get('sanpham/exports', [SanPhamController::class, 'exportSanPham']);
        Route::apiResource('sanpham', SanPhamController::class)->except(['show']);
        Route::post('sanpham/kich-hoat/{id}', [SanPhamController::class, 'kichHoatSanPham'])->name('sanpham.kichhoat');
        Route::post('sanpham/huy-kich-hoat/{id}', [SanPhamController::class, 'huyKichHoatSanPham'])->name('sanpham.huykichhoat');
        Route::get('sanpham/thung-rac', [SanPhamController::class, 'danhSachSanPhamDaXoa'])->name('sanpham.thungrac');
        Route::post('sanpham/thung-rac/{id}', [SanPhamController::class, 'khoiPhucSanPham'])->name('sanpham.kichhoat');
        Route::get('sanpham/{id}', [SanPhamController::class, 'show'])->name('sanpham.show');
        // Thẻ
        Route::apiResource('the', TheController::class)->except(['show']);
        Route::get('the/thung-rac', [TheController::class, 'danhSachTheDaXoa'])->name('the.thungrac');
        Route::post('the/thung-rac/{id}', [TheController::class, 'khoiPhucThe'])->name('the.khoiphuc');
        Route::get('the/{id}', [TheController::class, 'show'])->name('the.show');
        // Thông tin website
        Route::get('thong-tin-web', [ThongTinWebController::class, 'index'])->name('thongtinweb.index');
        Route::post('thong-tin-web', [ThongTinWebController::class, 'storeOrUpdate'])->name('thongtinweb.update');

        //Danh Mục Tin Tức
        Route::apiResource('danhmuctintuc', DanhMucTinTucController::class)->except(['show']);
        Route::get('danhmuctintuc/thung-rac', [DanhMucTinTucController::class, 'danhSachDanhMucTinTucDaXoa'])->name('danhmuctintuc.thungrac');
        Route::get('danhmuctintuc/{id}', [DanhMucTinTucController::class, 'show'])->name('danhmuctintuc.show');

        Route::post('danhmuctintuc/thung-rac/{id}', [DanhMucTinTucController::class, 'khoiPhucDanhMucTinTuc'])->name('danhmuctintuc.khoiphuc');
        Route::get('danhmuctintuc/{id}', [DanhMucTinTucController::class, 'show'])->name('danhmuctintuc.show');

        //Tin Tức
        Route::apiResource('tintuc', TinTucController::class)->except(['show']);
        Route::get('tintuc/thung-rac', [TinTucController::class, 'danhSachTinTucDaXoa'])->name('tintuc.thungrac');
        Route::post('tintuc/thung-rac/{id}', [TinTucController::class, 'khoiPhucTinTuc'])->name('tintuc.khoiphuc');
        Route::get('tintuc/{id}', [TinTucController::class, 'show'])->name('tintuc.show');

        // Mã khuyến mãi
        Route::post('makhuyenmai/kich-hoat/{id}', [MaKhuyenMaiController::class, 'kichHoatMaKhuyenMai']);
        Route::post('makhuyenmai/huy-kich-hoat/{id}', [MaKhuyenMaiController::class, 'huyKichMaKhuyenMai']);
        Route::apiResource('makhuyenmai', MaKhuyenMaiController::class)->except(['show']);
        Route::post('makhuyenmai/thongbao', [MaKhuyenMaiController::class, 'guiThongBao'])->name('makhuyenmai.thongbao');
        Route::get('makhuyenmai/thung-rac', [MaKhuyenMaiController::class, 'danhSachMaKhuyenMaiDaXoa'])->name('makhuyenmai.thungrac');
        Route::post('makhuyenmai/thung-rac/{id}', [MaKhuyenMaiController::class, 'khoiPhucMaKhuyenMai'])->name('makhuyenmai.khoiphuc');
        Route::get('makhuyenmai/{id}', [MaKhuyenMaiController::class, 'show'])->name('makhuyenmai.show');

        // Tài khoản
        Route::apiResource('taikhoan', TaiKhoanController::class)->except(['show']);
        Route::get('taikhoan/roles', [TaiKhoanController::class, 'danhSachVaiTro']);
        Route::get('taikhoan/thung-rac', [TaiKhoanController::class, 'danhSachTaiKhoanDaXoa'])->name('taikhoan.thungrac');
        Route::post('taikhoan/thung-rac/{id}', [TaiKhoanController::class, 'khoiPhucTaiKhoan'])->name('taikhoan.khoiphuc');
        Route::get('taikhoan/{id}', [TaiKhoanController::class, 'show'])->name('taikhoan.show');

        // Đơn hàng
        Route::get('/donhang', [DonHangController::class, 'index'])->name('donhang.index');
        Route::get('/donhang/{id}', [DonHangController::class, 'show'])->name('donhang.show');
        Route::get('/donhang/{id}/bill', [DonHangController::class, 'inHoaDon'])->name('donhang.bill');
        Route::put('/donhang/trang-thai-thanh-toan', [DonHangController::class, 'updatePaymentStatus'])->name('donhang.tttt');
        Route::put('/donhang/trang-thai-don-hang', [DonHangController::class, 'capNhatTrangThaiDonHang'])->name('donhang.ttdh');
        Route::get('/donhang/{id}', [DonHangController::class, 'show'])->name('donhang.show');

        Route::get('export-donhang', [DonHangController::class, 'export'])->name('donhang.export');
        // Kích thước biến thể
        Route::apiResource('bienthekichthuoc', BienTheKichThuocController::class)->except(['show']);
        Route::get('bienthekichthuoc/thung-rac', [BienTheKichThuocController::class, 'danhSachXoaMem'])->name('bienthekichthuoc.thungrac');
        Route::post('bienthekichthuoc/thung-rac/{id}', [BienTheKichThuocController::class, 'khoiPhucXoaMem'])->name('bienthekichthuoc.khoiphuc');
        Route::get('bienthekichthuoc/{id}', [BienTheKichThuocController::class, 'show'])->name('bienthekichthuoc.show');

        //Hạng thành viên
        Route::apiResource('hangthanhvien', HangThanhVienController::class)->except(['show']);
        // Route::get('hangthanhvien/{id}', [HangThanhVienController::class, 'show'])->name('hangthanhvien.show');
        Route::get('hangthanhvien/thung-rac', [HangThanhVienController::class, 'danhSachHangThanhVienDaXoa'])->name('hangthanhvien.thungrac');
        Route::post('hangthanhvien/thung-rac/{id}', [HangThanhVienController::class, 'khoiPhucHangThanhVien'])->name('hangthanhvien.khoiphuc');

        // Đánh giá
        Route::get('sanpham/{sanpham}/danhgia', [ApiDanhGiaController::class, 'danhSachDanhGiaAdmin']);

        // Thống kê
        //Thống kê doanh thu
        Route::get('/thong-ke/doanh-thu-ngay', [ThongKeDoanhThuController::class, 'doanhThuTheoNgay'])->name('thong-ke.doanh-thu-ngay');
        Route::get('/thong-ke/doanh-thu-tuan', [ThongKeDoanhThuController::class, 'doanhThuTheoTuan'])->name('doanh-thu-tuan.thong-ke');
        Route::get('/thong-ke/doanh-thu-thang', [ThongKeDoanhThuController::class, 'doanhThuTheoThang'])->name('doanh-thu-thang.thong-ke');
        Route::get('/thong-ke/doanh-thu-quy', [ThongKeDoanhThuController::class, 'doanhThuTheoQuy'])->name('doanh-thu-quy.thong-ke');
        Route::get('/thong-ke/doanh-thu-nam', [ThongKeDoanhThuController::class, 'doanhThuTheoNam'])->name('doanh-thu-nam.thong-ke.thong-ke');
        Route::get('/thong-ke/doanh-thu-san-pham', [ThongKeDoanhThuController::class, 'doanhThuTheoSanPham'])->name('doanh-thu-san-pham.thong-ke');
        Route::get('/thong-ke/doanh-thu-danh-muc', [ThongKeDoanhThuController::class, 'doanhThuTheoDanhMuc'])->name('doanh-thu-danh-muc.thong-ke');

        Route::get('/thong-ke/doanh-thu-so-sanh', [ThongKeDoanhThuController::class, 'soSanhDoanhThu'])->name("doanh-thu-so-sanh.thong-ke");
        Route::get('/thong-ke/don-hang-theo-trang-thai', [ThongKeDoanhThuController::class, 'thongKeDonHangTheoTrangThai'])->name("don-hang-theo-trang-thai.thong-ke");
        // Route thống kê theo tháng
        Route::get('/thong-ke/san-pham-ban-theo-thang', [ThongKeDoanhThuController::class, 'sanPhamBanChayTheoThang'])->name('san-pham-ban-theo-thang.thong-ke');
        // Route thống kê theo năm
        Route::get('/thong-ke/san-pham-ban-theo-nam', [ThongKeDoanhThuController::class, 'sanPhamBanChayTheoNam'])->name('san-pham-ban-theo-nam.thong-ke');

        // Màu sắc biến thể
        Route::apiResource('bienthemausac', BienTheMauSacController::class)->except(['show']);
        Route::get('bienthemausac/thung-rac', [BienTheMauSacController::class, 'danhSachXoaMem'])->name('bienthemausac.thungrac');
        Route::post('bienthemausac/thung-rac/{id}', [BienTheMauSacController::class, 'khoiPhucXoaMem'])->name('bienthemausac.khoiphuc');
        Route::get('bienthemausac/{id}', [BienTheMauSacController::class, 'show'])->name('bienthemausac.show');

        // Thống kê đánh giá
        Route::get('san-pham/{sanpham}/thong-ke-danh-gia', [ThongKeDanhGiaController::class, 'danhSachDanhGiaTheoSanPham']);

        //Vai trò
        Route::get('vaitro/routes', [VaiTroController::class, 'danhSachQuyen']);
        Route::apiResource('vaitro', VaiTroController::class);
        // Route::get('vaitro/thung-rac', [VaiTroController::class, 'danhSachVaiTroDaXoa'])->name('vaitro.thungrac');
        // Route::post('vaitro/thung-rac/{id}', [VaiTroController::class, 'khoiPhucVaiTro'])->name('vaitro.khoiphuc');
    });
