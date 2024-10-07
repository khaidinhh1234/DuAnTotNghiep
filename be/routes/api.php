<?php

use App\Http\Controllers\Admin\Api\BienTheKichThuocController;
use App\Http\Controllers\Admin\Api\BienTheMauSacController;
use App\Http\Controllers\Admin\Api\ChuongTrinhUuDaiController;
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
use App\Http\Controllers\Admin\Api\ThongKeDonHangController;
use App\Http\Controllers\Admin\Api\ThongKeKhachHangController;
use App\Http\Controllers\Admin\Api\VaiTroController;
use App\Http\Controllers\Admin\Api\ThongTinWebController;
use App\Http\Controllers\Admin\Api\TinTucController;
use App\Http\Controllers\Admin\Api\VanChuyenController;
use App\Http\Controllers\Client\Api\Auth\AuthController;
use App\Http\Controllers\Client\Api\Auth\CaptchaController;
use App\Http\Controllers\Client\Api\Auth\ChangePasswordController;
use App\Http\Controllers\Client\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Client\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Client\Api\DanhGiaController;
use App\Http\Controllers\Client\Api\GioHangController;
use App\Http\Controllers\Client\Api\DonHangClientController;
use App\Http\Controllers\Client\Api\KhuyenMaiController;
use App\Http\Controllers\Client\Api\LienHeController;
use App\Http\Controllers\Client\Api\TrangChuController;
use App\Http\Controllers\Client\Api\TrangSanPhamController;
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

Route::middleware([])
    ->name('client.')
    ->prefix('client')
    ->group(function () {
        // Trang chủ
        Route::get('trangchu', [TrangChuController::class, 'index']);

        Route::get('chuong-trinh-uu-dai/{slug}', [KhuyenMaiController::class, 'danhSachSanPhamChuongTrinhUuDai']);

        //Client Sản Phẩm
        // lấy ra danh mục cha
        Route::get('/danh-muc-cha', [TrangSanPhamController::class, 'danhMucCha']);

        // Lọc sản phẩm theo danh mục
        Route::post('/loc-san-pham-theo-danh-muc', [TrangSanPhamController::class, 'locSanPhamTheoDanhMuc']);

        // lấy ra màu sắc
        Route::get('/mau-sac', [TrangSanPhamController::class, 'mauSac']);

        // lọc theo màu sắc
        Route::post('/loc-san-pham-theo-mau-sac', [TrangSanPhamController::class, 'laySanPhamTheoMauSac'])->name('loc-theo-mau-sac');        // lấy ra màu sắc
        Route::get('/kich-thuoc', [TrangSanPhamController::class, 'kichThuoc'])->name('kich-thuoc');

        // lọc theo màu sắc
        Route::post('/loc-san-pham-theo-kich-thuoc', [TrangSanPhamController::class, 'laySanPhamTheoKichThuoc'])->name('loc-theo-kich-thuoc');
        Route::post('/loc-san-pham', [TrangSanPhamController::class, 'locSanPham'])->name('loc-san-pham');

        Route::post('/loc-san-pham-theo-mau-sac', [TrangSanPhamController::class, 'laySanPhamTheoMauSac']);

        // lấy ra kích thước
        Route::get('/kich-thuoc', [TrangSanPhamController::class, 'kichThuoc']);

        // lọc theo kích thước
        Route::post('/loc-san-pham-theo-kich-thuoc', [TrangSanPhamController::class, 'laySanPhamTheoKichThuoc']);

        //Client Chi tiết sản phẩm
        // Captcha
        Route::get('captcha', [CaptchaController::class, 'generateCaptcha']);
        Route::post('captcha/verify', [CaptchaController::class, 'verifyCaptcha']);

        // Đánh giá
        Route::get('sanpham/{sanpham}/danhgia', [DanhGiaController::class, 'danhSachDanhGia']);
        Route::post('danhgia', [DanhGiaController::class, 'themMoiDanhGia']);

        // Liên hệ
        Route::post('lienhe', [LienHeController::class, 'lienHe']);

        // Giỏ hàng
        Route::get('/gio-hang', [GioHangController::class, 'index']);
        Route::post('/gio-hang', [GioHangController::class, 'store']); // Thêm sản phẩm vào giỏ hàng
        Route::put('/gio-hang/{id}', [GioHangController::class, 'update']); // Cập nhật giỏ hàng
        Route::delete('/gio-hang/{id}', [GioHangController::class, 'destroy']); // Xóa sản phẩm khỏi giỏ hàng
        //Thanh toán
        //Thanh toán Momo
        Route::get('thanhtoan/momo', [DonHangClientController::class, 'thanhToanMomo']);
    });

//'auth:sanctum', 'auth.checkrole'.
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
        Route::patch('sanphams/khoi-phuc-xoa-mem-nhieu-san-pham', [SanPhamController::class, 'bulkRestore'])->name('sanphams.bulk-restore');
        Route::delete('sanphams', [SanPhamController::class, 'bulkDelete']);
        Route::patch('sanpham/trang-thai-nhieu-san-pham', [SanPhamController::class, 'updateStatus']);
        Route::patch('sanphams/cap-nhat-nhieu-san-pham-the', [SanPhamController::class, 'bulkUpdateTags'])->name('sanphams.update-tags');
        Route::get('sanpham/exports', [SanPhamController::class, 'exportSanPham']);
        Route::apiResource('sanpham', SanPhamController::class)->except(['show']);
        Route::post('sanpham/kich-hoat/{id}', [SanPhamController::class, 'kichHoatSanPham'])->name('sanpham.kichhoat');
        Route::post('sanpham/huy-kich-hoat/{id}', [SanPhamController::class, 'huyKichHoatSanPham'])->name('sanpham.huykichhoat');
        Route::get('sanpham/thung-rac', [SanPhamController::class, 'danhSachSanPhamDaXoa'])->name('sanpham.thungrac');
        Route::post('sanpham/thung-rac/{id}', [SanPhamController::class, 'khoiPhucSanPham'])->name('sanpham.khoiphuc');
        Route::get('sanpham/{id}', [SanPhamController::class, 'show'])->name('sanpham.show');
        Route::get('sanpham/yeuthich/{id}', [SanPhamController::class, 'sanPhamYeuThich']);

        // Kích thước biến thể
        Route::apiResource('bienthekichthuoc', BienTheKichThuocController::class)->except(['show']);
        Route::get('bienthekichthuoc/thung-rac', [BienTheKichThuocController::class, 'danhSachXoaMem'])->name('bienthekichthuoc.thungrac');
        Route::post('bienthekichthuoc/thung-rac/{id}', [BienTheKichThuocController::class, 'khoiPhucXoaMem'])->name('bienthekichthuoc.khoiphuc');
        Route::get('bienthekichthuoc/{id}', [BienTheKichThuocController::class, 'show'])->name('bienthekichthuoc.show');

        // Màu sắc biến thể
        Route::apiResource('bienthemausac', BienTheMauSacController::class)->except(['show']);
        Route::get('bienthemausac/thung-rac', [BienTheMauSacController::class, 'danhSachXoaMem'])->name('bienthemausac.thungrac');
        Route::post('bienthemausac/thung-rac/{id}', [BienTheMauSacController::class, 'khoiPhucXoaMem'])->name('bienthemausac.khoiphuc');
        Route::get('bienthemausac/{id}', [BienTheMauSacController::class, 'show'])->name('bienthemausac.show');

        // Thẻ
        Route::apiResource('the', TheController::class)->except(['show']);
        Route::get('the/thung-rac', [TheController::class, 'danhSachTheDaXoa'])->name('the.thungrac');
        Route::post('the/thung-rac/{id}', [TheController::class, 'khoiPhucThe'])->name('the.khoiphuc');
        Route::get('the/{id}', [TheController::class, 'show'])->name('the.show');

        // Đánh giá
        Route::get('danhsachdanhgia', [ApiDanhGiaController::class, 'danhSachDanhGiaAll']);
        Route::get('sanpham/{sanpham}/danhgia', [ApiDanhGiaController::class, 'DanhGiaTheoSanPham']);
        Route::post('danhsachdanhgia/{danhgia}', [ApiDanhGiaController::class, 'phanHoiDanhGia']);

        // Đơn hàng
        Route::get('/donhang', [DonHangController::class, 'index'])->name('donhang.index');
        Route::get('/donhang/{id}', [DonHangController::class, 'show'])->name('donhang.show');
        Route::get('/donhang/{id}/bill', [DonHangController::class, 'inHoaDon'])->name('donhang.bill');
        Route::put('/donhang/trang-thai-thanh-toan', [DonHangController::class, 'updatePaymentStatus'])->name('donhang.tttt');
        Route::put('/donhang/trang-thai-don-hang', [DonHangController::class, 'capNhatTrangThaiDonHang'])->name('donhang.ttdh');
        Route::get('export-donhang', [DonHangController::class, 'export'])->name('donhang.export');
        Route::get('/donhang/{id}', [DonHangController::class, 'show'])->name('donhang.show');
        Route::get('lay-thong-tin-don', [DonHangController::class, 'layThongTinDon']);


        //Vận chuyển
        Route::get('/vanchuyen', [VanChuyenController::class, 'index'])->name('vanchuyen.index');
        Route::get('/vanchuyen/{id}', [VanChuyenController::class, 'show'])->name('vanchuyen.show');
        Route::put('/vanchuyen/trang-thai-van-chuyen', [VanChuyenController::class, 'capNhatTrangThaiVanChuyen'])->name('vanchuyen.ttvc');
        Route::get('lay-thong-tin-van-chuyen', [VanChuyenController::class, 'layThongTinVanChuyen']);

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

        // Chương trình ưu đãi
        Route::apiResource('chuongtrinhuudai', ChuongTrinhUuDaiController::class)->except(['show']);
        Route::get('chuongtrinhuudai/thung-rac', [ChuongTrinhUuDaiController::class, 'danhSachXoaMem'])->name('chuongtrinhuudai.thungrac');
        Route::post('chuongtrinhuudai/thung-rac/{id}', [ChuongTrinhUuDaiController::class, 'khoiPhucXoaMem'])->name('chuongtrinhuudai.khoiphuc');
        Route::get('chuongtrinhuudai/{id}', [ChuongTrinhUuDaiController::class, 'show'])->name('chuongtrinhuudai.show');

        // Mã khuyến mãi
        Route::post('makhuyenmai/kich-hoat/{id}', [MaKhuyenMaiController::class, 'kichHoatMaKhuyenMai']);
        Route::post('makhuyenmai/huy-kich-hoat/{id}', [MaKhuyenMaiController::class, 'huyKichHoatMaKhuyenMai']);
        Route::apiResource('makhuyenmai', MaKhuyenMaiController::class)->except(['show']);
        Route::post('makhuyenmai/thongbao', [MaKhuyenMaiController::class, 'guiThongBao'])->name('makhuyenmai.thongbao');
        Route::get('makhuyenmai/thung-rac', [MaKhuyenMaiController::class, 'danhSachMaKhuyenMaiDaXoa'])->name('makhuyenmai.thungrac');
        Route::post('makhuyenmai/thung-rac/{id}', [MaKhuyenMaiController::class, 'khoiPhucMaKhuyenMai'])->name('makhuyenmai.khoiphuc');
        Route::get('makhuyenmai/{id}', [MaKhuyenMaiController::class, 'show'])->name('makhuyenmai.show');

        // Thông tin website
        Route::get('thong-tin-web', [ThongTinWebController::class, 'index'])->name('thongtinweb.index');
        Route::post('thong-tin-web', [ThongTinWebController::class, 'storeOrUpdate'])->name('thongtinweb.update');

        // Tài khoản
        Route::apiResource('taikhoan', TaiKhoanController::class)->except(['show']);
        Route::get('taikhoan/roles', [TaiKhoanController::class, 'danhSachVaiTro']);
        Route::get('taikhoan/thung-rac', [TaiKhoanController::class, 'danhSachTaiKhoanDaXoa'])->name('taikhoan.thungrac');
        Route::post('taikhoan/thung-rac/{id}', [TaiKhoanController::class, 'khoiPhucTaiKhoan'])->name('taikhoan.khoiphuc');
        Route::get('taikhoan/{id}', [TaiKhoanController::class, 'show'])->name('taikhoan.show');

        //Hạng thành viên
        Route::apiResource('hangthanhvien', HangThanhVienController::class)->except(['show']);
        Route::get('hangthanhvien/thung-rac', [HangThanhVienController::class, 'danhSachHangThanhVienDaXoa'])->name('hangthanhvien.thungrac');
        Route::post('hangthanhvien/thung-rac/{id}', [HangThanhVienController::class, 'khoiPhucHangThanhVien'])->name('hangthanhvien.khoiphuc');
        Route::get('hangthanhvien/{id}', [HangThanhVienController::class, 'show'])->name('hangthanhvien.show');

        //Vai trò
        Route::get('vaitro/routes', [VaiTroController::class, 'danhSachQuyen']);
        Route::apiResource('vaitro', VaiTroController::class);
        // Route::get('vaitro/thung-rac', [VaiTroController::class, 'danhSachVaiTroDaXoa'])->name('vaitro.thungrac');
        // Route::post('vaitro/thung-rac/{id}', [VaiTroController::class, 'khoiPhucVaiTro'])->name('vaitro.khoiphuc');

        // Thống kê
        //Thống kê doanh thu
        Route::prefix('thong-ke')->group(function () {
            // Tổng quan thống kê
            Route::post('/doanh-thu-tuan-tu', [ThongKeDoanhThuController::class, 'thongKeDoanhThuTuanTu'])->name('thongKeDoanhThuTuanTu');
            Route::get('/doanh-thu-ngay', [ThongKeDoanhThuController::class, 'doanhThuTheoNgay'])->name('thong-ke.doanh-thu-ngay');
            Route::post('/doanh-thu-tuan', [ThongKeDoanhThuController::class, 'doanhThuTheoTuan'])->name('doanh-thu-tuan.thong-ke');
            Route::post('/doanh-thu-thang', [ThongKeDoanhThuController::class, 'doanhThuTheoThang'])->name('doanh-thu-thang.thong-ke');
            Route::post('/doanh-thu-quy', [ThongKeDoanhThuController::class, 'doanhThuTheoQuy'])->name('doanh-thu-quy.thong-ke');
            Route::post('/doanh-thu-nam', [ThongKeDoanhThuController::class, 'doanhThuTheoNam'])->name('doanh-thu-nam.thong-ke.thong-ke');

            //Thống kê danh mục
            Route::post('/doanh-thu-danh-muc', [ThongKeDoanhThuController::class, 'doanhThuTheoDanhMuc'])->name('doanh-thu-danh-muc.thong-ke');
            Route::get('/danh-muc', [ThongKeDoanhThuController::class, 'layTatCaDanhMuc']);
            Route::post('/doanh-thu-theo-danh-muc', action: [ThongKeDoanhThuController::class, 'thongKeDoanhThuTheoDanhMuc']);
            Route::get('/doanh-thu-so-sanh', [ThongKeDoanhThuController::class, 'soSanhDoanhThuThang'])->name("doanh-thu-so-sanh.thong-ke");
            // Route thống kê sản phẩm
            Route::get('/doanh-thu-san-pham', [ThongKeDoanhThuController::class, 'doanhThuTheoSanPham'])->name('doanh-thu-san-pham.thong-ke');
            Route::post('/doanh-thu-tung-san-pham', [ThongKeDoanhThuController::class, 'doanhThuTheoTungSanPham'])->name('doanh-thu-tung-san-pham.thong-ke');
            Route::get('/san-pham-ban-theo-thang', [ThongKeDoanhThuController::class, 'sanPhamBanChayTheoThang'])->name('san-pham-ban-theo-thang.thong-ke');
            Route::get('/san-pham-ban-theo-nam', [ThongKeDoanhThuController::class, 'sanPhamBanChayTheoNam'])->name('san-pham-ban-theo-nam.thong-ke');
            Route::get('/so-luong-ton-kho-cua-san-pham', [ThongKeDoanhThuController::class, 'soLuongTonKhoCuaSanPham'])->name('so-luong-ton-kho-cua-san-pham.thong-ke');
            Route::get('/so-luong-san-pham-sap-het-hang', [ThongKeDoanhThuController::class, 'soLuongSanPhamSapHetHang'])->name('so-luong-san-pham-sap-het-hang.thong-ke');
            //Route Thống kê hạng thành viên
            Route::get('/khach-hang-theo-hang-thanh-vien', [ThongKeKhachHangController::class, 'thongKeKhachHangTheoHangThanhVien'])->name('khach-hang-theo-hang-thanh-vien.thong-ke');
            Route::get('/khach-hang-moi-theo-hang', [ThongKeKhachHangController::class, 'thongKeKhachHangMoiTheoHangThanhVien'])->name('khach-hang-moi-theo-hang.thong-ke');
            //Route thống kêkhách hàng mới
            Route::get('/khach-hang-moi-theo-tung-thang', [ThongKeKhachHangController::class, 'thongKeKhachHangMoi'])->name('khach-hang-moi-theo-tung-thang.thong-ke');
            Route::get('/khach-hang-quay-lai-theo-thang', [ThongKeKhachHangController::class, 'thongKeKhachHangQuayLaiTheoThang'])->name('khach-hang-quay-lai-theo-thang.thong-ke');
            Route::get('/don-hang-theo-trang-thai', [ThongKeDonHangController::class, 'thongKeDonHangTheoTrangThai'])->name("don-hang-theo-trang-thai.thong-ke");
            Route::get('/hoan-hang-theo-thang', [ThongKeDonHangController::class, 'thongKeHoanHang'])->name('hoan-hang-theo-thang.thong-ke');
            Route::get('/huy-hang-theo-thang', [ThongKeDonHangController::class, 'thongKeHuyHangTheoThang'])->name('huy-hang-theo-thang.thong-ke');

            Route::get('/so-sanh-don-hang-thang', [ThongKeDonHangController::class, 'soSanhDonHangThang'])->name('soSanhDonHangThang');
            Route::get('/top5-khach-hang-gan-day', [ThongKeKhachHangController::class, 'thongKeTop5KhachHangGanDay']);
            Route::get('/so-sanh-khach-hang-register', [ThongKeKhachHangController::class, 'soSanhKhachHangRegister'])->name('soSanhKhachHangRegister');
            Route::get('/so-sanh-khach-hang-activity', [ThongKeKhachHangController::class, 'soSanhKhachHangBlock'])->name('soSanhKhachHangActivity');
            Route::post('/tim-kiem-thanh-vien-theo-hang', [ThongKeKhachHangController::class, 'timKiemThanhVienTheoHang']);

            // Thống kê đánh giá
            Route::get('/{sanpham}/thong-ke-danh-gia', [ThongKeDanhGiaController::class, 'danhSachDanhGiaTheoSanPham'])->name('thong-ke-danh-gia.thong-ke');
        });
    });
