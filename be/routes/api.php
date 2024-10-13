<?php

use App\Http\Controllers\Admin\Api\BienTheKichThuocController;
use App\Http\Controllers\Admin\Api\BienTheMauSacController;
use App\Http\Controllers\Admin\Api\BoSuuTapController;
use App\Http\Controllers\Admin\Api\ChuongTrinhUuDaiController;
use App\Http\Controllers\Admin\Api\DanhGiaController as AdminDanhGiaController;
use App\Http\Controllers\Admin\Api\LichSuHoatDongController;
use App\Http\Controllers\Admin\Api\LienHeController as AdminLienHeController;
use App\Http\Controllers\Admin\Api\DanhMucController;
use App\Http\Controllers\Admin\Api\MaKhuyenMaiController;
use App\Http\Controllers\Admin\Api\DanhMucTinTucController;
use App\Http\Controllers\Admin\Api\DonHangController;
use App\Http\Controllers\Admin\Api\HangThanhVienController;
use App\Http\Controllers\Admin\Api\SanPhamController;
use App\Http\Controllers\Admin\Api\TaiKhoanController;
use App\Http\Controllers\Admin\Api\TheController;
use App\Http\Controllers\Admin\Api\ThongKeDanhGiaController;
use App\Http\Controllers\Admin\Api\ThongKeDanhMuc;
use App\Http\Controllers\Admin\API\ThongKeDoanhThuController;
use App\Http\Controllers\Admin\Api\ThongKeDonHangController;
use App\Http\Controllers\Admin\Api\ThongKeKhachHangController;
use App\Http\Controllers\Admin\Api\ThongKeSanPham;
use App\Http\Controllers\Admin\Api\ThongKeTongQuanController;
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
use App\Http\Controllers\Client\Api\TrangChiTietSpController;
use App\Http\Controllers\Client\Api\TrangLienHeController;
use App\Http\Controllers\Client\Api\TrangChuController;
use App\Http\Controllers\Client\Api\TrangSanPhamController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth.sanctum');
Route::post('/change-password', [ChangePasswordController::class, 'changePassword'])->middleware('auth.sanctum');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/check-token-forgot', [ResetPasswordController::class, 'checkTokenForgot']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);

Route::middleware([])
    ->name('client.')
    ->prefix('client')
    ->group(function () {
        // Trang chủ
        Route::get('trangchu', [TrangChuController::class, 'index']);

        //Chương trình ưu đãi và mã khuyến mãi
        Route::get('chuong-trinh-uu-dai/{slug}', [KhuyenMaiController::class, 'danhSachSanPhamChuongTrinhUuDai']);
        Route::get('ma-khuyen-mai', [KhuyenMaiController::class, 'layMaKhuyenMaiTheoHangThanhVien']);
        Route::post('thu-thap-ma-khuyen-mai/{ma_code}', [KhuyenMaiController::class, 'thuThapMaKhuyenMai']);

        //Client Sản Phẩm
        // Lấy ra danh mục cha
        Route::get('/danh-muc-cha', [TrangSanPhamController::class, 'danhMucCha']);

        // Client trang chi tiết sản phẩm
        Route::get('/chi-tiet-san-pham/{id}', [TrangChiTietSpController::class, 'chiTietSanPham']);
        Route::get('/danh-sach-san-pham-cung-loai/{id}', [TrangChiTietSpController::class, 'danhSachSanPhamCungLoai']);

        // Lọc sản phẩm theo danh mục
        Route::post('/loc-san-pham-theo-danh-muc', [TrangSanPhamController::class, 'locSanPhamTheoDanhMuc']);

        // Lấy ra màu sắc
        Route::get('/mau-sac', [TrangSanPhamController::class, 'mauSac']);

        // Lọc theo màu sắc
        Route::post('/loc-san-pham-theo-mau-sac', [TrangSanPhamController::class, 'laySanPhamTheoMauSac'])->name('loc-theo-mau-sac');        // lấy ra màu sắc
        Route::get('/kich-thuoc', [TrangSanPhamController::class, 'kichThuoc'])->name('kich-thuoc');

        // Lọc theo màu sắc
        Route::post('/loc-san-pham-theo-kich-thuoc', [TrangSanPhamController::class, 'laySanPhamTheoKichThuoc'])->name('loc-theo-kich-thuoc');
        Route::post('/loc-san-pham', [TrangSanPhamController::class, 'locSanPham'])->name('loc-san-pham');
        Route::post('/loc-san-pham-theo-mau-sac', [TrangSanPhamController::class, 'laySanPhamTheoMauSac']);

        // Lấy ra kích thước
        Route::get('/kich-thuoc', [TrangSanPhamController::class, 'kichThuoc']);

        // Lọc theo kích thước
        Route::post('/loc-san-pham-theo-kich-thuoc', [TrangSanPhamController::class, 'laySanPhamTheoKichThuoc']);

        //Client Chi tiết sản phẩm
        // Captcha
        Route::get('captcha', [CaptchaController::class, 'generateCaptcha']);
        Route::post('captcha/verify', [CaptchaController::class, 'verifyCaptcha']);

        // Đánh giá
        Route::get('sanpham/{sanpham}/danhgia', [DanhGiaController::class, 'danhSachDanhGia']);
        Route::post('danhgia', [DanhGiaController::class, 'themMoiDanhGia']);

        // Liên hệ
        Route::post('lienhe', [TrangLienHeController::class, 'lienHe']);

        // Giỏ hàng
        Route::get('/gio-hang', [GioHangController::class, 'index']);
        Route::post('/gio-hang', [GioHangController::class, 'store']); // Thêm sản phẩm vào giỏ hàng
        Route::put('/gio-hang/{id}', [GioHangController::class, 'update']); // Cập nhật giỏ hàng
        Route::delete('/gio-hang/{id}', [GioHangController::class, 'destroy']); // Xóa sản phẩm khỏi giỏ hàng

        //Thanh toán
        //Thanh toán Momo
        Route::get('thanhtoan/momo', [DonHangClientController::class, 'thanhToanMomo']);
    });


//'auth.sanctum'
Route::middleware(['auth.sanctum'])
    ->name('admin.')
    ->prefix('admin')
    ->group(function () {
        // Danh muc
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('danhmuc',  DanhMucController::class)->except(['show']);
                Route::get('danhmuc/thung-rac', [DanhMucController::class, 'danhSachDanhMucDaXoa'])->name('danhmuc.thungrac');
                Route::get('danhmuc/{id}', [DanhMucController::class, 'show'])->name('danhmuc.show');
                Route::post('danhmuc/thung-rac/{id}', [DanhMucController::class, 'khoiPhucDanhMuc'])->name('danhmuc.khoiphuc');
                Route::get('danhmuc/{id}', [DanhMucController::class, 'show'])->name('danhmuc.show');
            });

        // Sản phẩm
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('sanpham', SanPhamController::class)->except(['show']);
                Route::patch('sanpham/khoi-phuc-xoa-mem-nhieu-san-pham', [SanPhamController::class, 'bulkRestore'])->name('sanpham.bulk-restore');
                Route::delete('sanpham', [SanPhamController::class, 'bulkDelete'])->name('sanpham.bulk-delete');
                Route::patch('sanpham/trang-thai-nhieu-san-pham', [SanPhamController::class, 'updateStatus'])->withoutMiddleware('auth.checkrole');
                Route::patch('sanpham/cap-nhat-nhieu-san-pham-the', [SanPhamController::class, 'bulkUpdateTags'])->name('sanpham.update-tags');
                Route::get('sanpham/exports', [SanPhamController::class, 'exportSanPham'])->withoutMiddleware('auth.checkrole');
                Route::post('sanpham/kich-hoat/{id}', [SanPhamController::class, 'kichHoatSanPham'])->name('sanpham.kichhoat');
                Route::post('sanpham/huy-kich-hoat/{id}', [SanPhamController::class, 'huyKichHoatSanPham'])->name('sanpham.huykichhoat');
                Route::get('sanpham/thung-rac', [SanPhamController::class, 'danhSachSanPhamDaXoa'])->name('sanpham.thungrac');
                Route::post('sanpham/thung-rac/{id}', [SanPhamController::class, 'khoiPhucSanPham'])->name('sanpham.khoiphuc');
                Route::get('sanpham/{id}', [SanPhamController::class, 'show'])->name('sanpham.show');
                Route::get('sanpham/yeuthich/{id}', [SanPhamController::class, 'sanPhamYeuThich'])->withoutMiddleware('auth.checkrole');
            });

        // Kích thước biến thể
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('bienthekichthuoc', BienTheKichThuocController::class)->except(['show']);
                Route::get('bienthekichthuoc/thung-rac', [BienTheKichThuocController::class, 'danhSachXoaMem'])->name('bienthekichthuoc.thungrac');
                Route::post('bienthekichthuoc/thung-rac/{id}', [BienTheKichThuocController::class, 'khoiPhucXoaMem'])->name('bienthekichthuoc.khoiphuc');
                Route::get('bienthekichthuoc/{id}', [BienTheKichThuocController::class, 'show'])->name('bienthekichthuoc.show');
            });

        // Màu sắc biến thể
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('bienthemausac', BienTheMauSacController::class)->except(['show']);
                Route::get('bienthemausac/thung-rac', [BienTheMauSacController::class, 'danhSachXoaMem'])->name('bienthemausac.thungrac');
                Route::post('bienthemausac/thung-rac/{id}', [BienTheMauSacController::class, 'khoiPhucXoaMem'])->name('bienthemausac.khoiphuc');
                Route::get('bienthemausac/{id}', [BienTheMauSacController::class, 'show'])->name('bienthemausac.show');
            });

        // Bộ sưu tập
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('bosuutap',  BoSuuTapController::class)->except(['show']);
                Route::get('bosuutap/thung-rac', [BoSuuTapController::class, 'danhSachBoSuuTapDaXoa'])->name('bosuutap.thungrac');
                Route::post('bosuutap/thung-rac/{id}', [BoSuuTapController::class, 'khoiPhucBoSuuTap'])->name('bosuutap.khoiphuc');
                Route::get('bosuutap/{id}', [BoSuuTapController::class, 'show'])->name('bosuutap.show');
            });

        // Đánh giá
        Route::get('danhsachdanhgia', [AdminDanhGiaController::class, 'danhSachDanhGiaAll']);
        Route::get('sanpham/{sanpham}/danhgia', [AdminDanhGiaController::class, 'DanhGiaTheoSanPham']);
        Route::post('danhsachdanhgia/{danhgia}', [AdminDanhGiaController::class, 'phanHoiDanhGia']);

        // Đơn hàng
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::get('donhang', [DonHangController::class, 'index'])->name('donhang.index');
                Route::get('donhang/{id}', [DonHangController::class, 'show'])->name('donhang.show');
                Route::get('donhang/{id}/bill', [DonHangController::class, 'inHoaDon'])->name('donhang.bill');
                Route::put('donhang/trang-thai-thanh-toan', [DonHangController::class, 'updatePaymentStatus'])->name('donhang.tttt');
                Route::put('donhang/trang-thai-don-hang', [DonHangController::class, 'capNhatTrangThaiDonHang'])->name('donhang.ttdh');
                Route::get('donhang/export', [DonHangController::class, 'export'])->name('donhang.export');
                Route::get('donhang/{id}', [DonHangController::class, 'show'])->name('donhang.show');
                Route::get('donhang/lay-thong-tin-don', [DonHangController::class, 'layThongTinDon'])->withoutMiddleware('auth.checkrole');
            });

        //Vận chuyển
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::get('vanchuyen', [VanChuyenController::class, 'index'])->name('vanchuyen.index');
                Route::get('vanchuyen/{id}', [VanChuyenController::class, 'show'])->name('vanchuyen.show');
                Route::put('vanchuyen/trang-thai-van-chuyen', [VanChuyenController::class, 'capNhatTrangThaiVanChuyen'])->name('vanchuyen.ttvc');
                Route::get('vanchuyen/lay-thong-tin-van-chuyen', [VanChuyenController::class, 'layThongTinVanChuyen'])->withoutMiddleware('auth.checkrole');
                Route::put('vanchuyen/xac-nhan-van-chuyen/{id}', [VanChuyenController::class, 'xacNhanVanChuyen'])->name('vanchuyen.xacnhan');
            });

        //Danh Mục Tin Tức
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('danhmuctintuc', DanhMucTinTucController::class)->except(['show']);
                Route::get('danhmuctintuc/thung-rac', [DanhMucTinTucController::class, 'danhSachDanhMucTinTucDaXoa'])->name('danhmuctintuc.thungrac');
                Route::get('danhmuctintuc/{id}', [DanhMucTinTucController::class, 'show'])->name('danhmuctintuc.show');
                Route::post('danhmuctintuc/thung-rac/{id}', [DanhMucTinTucController::class, 'khoiPhucDanhMucTinTuc'])->name('danhmuctintuc.khoiphuc');
                Route::get('danhmuctintuc/{id}', [DanhMucTinTucController::class, 'show'])->name('danhmuctintuc.show');
            });

        //Tin Tức
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('tintuc', TinTucController::class)->except(['show']);
                Route::get('tintuc/thung-rac', [TinTucController::class, 'danhSachTinTucDaXoa'])->name('tintuc.thungrac');
                Route::post('tintuc/thung-rac/{id}', [TinTucController::class, 'khoiPhucTinTuc'])->name('tintuc.khoiphuc');
                Route::get('tintuc/{id}', [TinTucController::class, 'show'])->name('tintuc.show');
            });

        // Chương trình ưu đãi
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('chuongtrinhuudai', ChuongTrinhUuDaiController::class)->except(['show']);
                Route::get('chuongtrinhuudai/thung-rac', [ChuongTrinhUuDaiController::class, 'danhSachXoaMem'])->name('chuongtrinhuudai.thungrac');
                Route::post('chuongtrinhuudai/thung-rac/{id}', [ChuongTrinhUuDaiController::class, 'khoiPhucXoaMem'])->name('chuongtrinhuudai.khoiphuc');
                Route::get('chuongtrinhuudai/{id}', [ChuongTrinhUuDaiController::class, 'show'])->name('chuongtrinhuudai.show');
            });

        // Mã khuyến mãi
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::post('makhuyenmai/kich-hoat/{id}', [MaKhuyenMaiController::class, 'kichHoatMaKhuyenMai'])->withoutMiddleware('auth.checkrole');
                Route::post('makhuyenmai/huy-kich-hoat/{id}', [MaKhuyenMaiController::class, 'huyKichHoatMaKhuyenMai'])->withoutMiddleware('auth.checkrole');
                Route::apiResource('makhuyenmai', MaKhuyenMaiController::class)->except(['show']);
                Route::post('makhuyenmai/thongbao', [MaKhuyenMaiController::class, 'guiThongBao'])->name('makhuyenmai.thongbao');
                Route::get('makhuyenmai/thung-rac', [MaKhuyenMaiController::class, 'danhSachMaKhuyenMaiDaXoa'])->name('makhuyenmai.thungrac');
                Route::post('makhuyenmai/thung-rac/{id}', [MaKhuyenMaiController::class, 'khoiPhucMaKhuyenMai'])->name('makhuyenmai.khoiphuc');
                Route::get('makhuyenmai/{id}', [MaKhuyenMaiController::class, 'show'])->name('makhuyenmai.show');
            });

        // Thông tin website
        Route::get('thong-tin-web', [ThongTinWebController::class, 'index'])->name('thongtinweb.index');
        Route::post('thong-tin-web', [ThongTinWebController::class, 'storeOrUpdate'])->name('thongtinweb.update');

        // Tài khoản
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('taikhoan', TaiKhoanController::class)->except(['show']);
                Route::get('taikhoan/roles', [TaiKhoanController::class, 'danhSachVaiTro'])->withoutMiddleware('auth.checkrole');
                Route::get('taikhoan/thung-rac', [TaiKhoanController::class, 'danhSachTaiKhoanDaXoa'])->name('taikhoan.thungrac');
                Route::post('taikhoan/thung-rac/{id}', [TaiKhoanController::class, 'khoiPhucTaiKhoan'])->name('taikhoan.khoiphuc');
                Route::get('taikhoan/{id}', [TaiKhoanController::class, 'show'])->name('taikhoan.show');
            });

        //Hạng thành viên
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('hangthanhvien', HangThanhVienController::class)->except(['show']);
                Route::get('hangthanhvien/thung-rac', [HangThanhVienController::class, 'danhSachHangThanhVienDaXoa'])->name('hangthanhvien.thungrac');
                Route::post('hangthanhvien/thung-rac/{id}', [HangThanhVienController::class, 'khoiPhucHangThanhVien'])->name('hangthanhvien.khoiphuc');
                Route::get('hangthanhvien/{id}', [HangThanhVienController::class, 'show'])->name('hangthanhvien.show');
            });

        // Liên hệ
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::get('lien-he', [AdminLienHeController::class, 'danhSachLienHe'])->name('lienhe.index');
                Route::put('lien-he/{id}', [AdminLienHeController::class, 'phanHoi'])->name('lienhe.phanhoi');
            });

        //Vai trò auth.checkrole
        //Vai trò auth.checkrole'auth.checkrole'
        Route::middleware([])
            ->group(function () {
                Route::apiResource('vaitro', VaiTroController::class)->except('show');
                Route::get('vaitro/routes', [VaiTroController::class, 'danhSachQuyen'])->withoutMiddleware('auth.checkrole');
                Route::get('vaitro/{id}', [VaiTroController::class, 'show'])->name('vaitro.show');
                // Route::get('/thung-rac', [VaiTroController::class, 'danhSachVaiTroDaXoa'])->name('vaitro.thungrac');
                // Route::post('/thung-rac/{id}', [VaiTroController::class, 'khoiPhucVaiTro'])->name('vaitro.khoiphuc');
            });

        // Thống kê
        //Thống kê doanh thu
        Route::prefix('thong-ke')->group(function () {
            // Tổng quan thống kê
            Route::get('/doanh-thu-ngay', [ThongKeDoanhThuController::class, 'doanhThuTheoNgay']);
            Route::post('/doanh-thu-tuan-tu', [ThongKeDoanhThuController::class, 'thongKeDoanhThuTuanTu']);

            Route::post('/doanh-thu-tuan', [ThongKeDoanhThuController::class, 'doanhThuTheoTuan']);
            Route::post('/doanh-thu-thang', [ThongKeDoanhThuController::class, 'doanhThuTheoThang']);
            Route::post('/doanh-thu-quy', [ThongKeDoanhThuController::class, 'doanhThuTheoQuy']);
            Route::post('/doanh-thu-nam', [ThongKeDoanhThuController::class, 'doanhThuTheoNam']);

            //Thống kê danh mục
            Route::post('/doanh-thu-danh-muc', [ThongKeDanhMuc::class, 'doanhThuTheoDanhMuc']);

            Route::get('/danh-muc', [ThongKeDanhMuc::class, 'layTatCaDanhMuc']);
            Route::post('/doanh-thu-theo-danh-muc', [ThongKeDanhMuc::class, 'thongKeDoanhThuTheoDanhMuc']);
            Route::post('/danh-muc/so-luong-ban-san-pham', [ThongKeDanhMuc::class, 'demSoLuongSPBanTheoDanhMuc']);
            // Thống kê đơn hàng
            Route::post('/danh-muc/don-hang-thanh-cong', [ThongKeDanhMuc::class, 'demDHTheoDanhMuc']);
            Route::post('/danh-muc/don-hang-bi-huy', [ThongKeDanhMuc::class, 'demDHHuyTheoDanhMuc']);

            Route::get('/don-hang-theo-trang-thai', [ThongKeDonHangController::class, 'thongKeDonHangTheoTrangThai'])->name("don-hang-theo-trang-thai.thong-ke");

            // Thống kê tổng quan
            Route::post('don-hang/hoan-hang', [ThongKeTongQuanController::class, 'thongKeHoanHang']);
            Route::post('/huy-hang-theo-thang', [ThongKeTongQuanController::class, 'thongKeHuyHang']);
            Route::post('don-hang/chot',  [ThongKeTongQuanController::class, 'thongKeDonHangChot']);
            Route::post('san-pham/ton-kho',  [ThongKeTongQuanController::class, 'thongKeSanPhamTonKho']);
            Route::post('doanh-thu/tong', [ThongKeTongQuanController::class, 'thongKeDoanhThuTong']);
            Route::post('doanh-thu/thanh-toan-online', [ThongKeTongQuanController::class, 'thongKeThanhToanOnline']);
            Route::post('doanh-thu/thanh-toan-off', action: [ThongKeTongQuanController::class, 'thongKeThanhToanOff']);
            Route::post('doanh-so', [ThongKeTongQuanController::class, 'thongKeDoanhSo']);
            Route::post('doanh-thu/tb', [ThongKeTongQuanController::class, 'thongKeDoanhThuTB']);
            Route::post('don-hang/trang-thai', [ThongKeTongQuanController::class, 'trangThaiKhoangDonSoSanh']);
            Route::get('/don-hang-theo-trang-thai', [ThongKeDonHangController::class, 'thongKeDonHangTheoTrangThai']);

            // Thống kê tuần tự
            Route::get('/doanh-thu-so-sanh', [ThongKeDoanhThuController::class, 'soSanhDoanhThuThang']);

            Route::get('/so-sanh-don-hang-thang', [ThongKeDonHangController::class, 'soSanhDonHangThang']);
            Route::get('/so-sanh-khach-hang-register', [ThongKeKhachHangController::class, 'soSanhKhachHangRegister']);
            Route::get('/so-sanh-khach-hang-block', [ThongKeKhachHangController::class, 'soSanhKhachHangBlock']);
            Route::post('/doanh-thu-tuan-tu', [ThongKeDoanhThuController::class, 'thongKeDoanhThuTuanTu']);
            Route::get('/top5-khach-hang-gan-day', [ThongKeKhachHangController::class, 'thongKeTop5KhachHangGanDay']);

            // Route thống kê sản phẩm
            Route::post('/doanh-thu-tung-san-pham', [ThongKeSanPham::class, 'thongKeDoanhThuTheoSanPham']);
            Route::post('/doanh-thu-theo-tung-san-pham', [ThongKeSanPham::class, 'thongKeDoanhThuTheoSanPham']);
            Route::get('/san-pham-ban-theo-thang', [ThongKeSanPham::class, 'sanPhamBanChayTheoThang']);
            Route::get('/san-pham-ban-theo-nam', [ThongKeSanPham::class, 'sanPhamBanChayTheoNam']);
            Route::get('/so-luong-ton-kho-cua-san-pham', [ThongKeSanPham::class, 'soLuongTonKhoCuaSanPham']);
            Route::get('/so-luong-san-pham-sap-het-hang', [ThongKeSanPham::class, 'soLuongSanPhamSapHetHang']);


            //Route Thống kê hạng thành viên
            Route::get('/khach-hang-theo-hang-thanh-vien', [ThongKeKhachHangController::class, 'thongKeKhachHangTheoHangThanhVien']);
            Route::get('/khach-hang-moi-theo-hang', [ThongKeKhachHangController::class, 'thongKeKhachHangMoiTheoHangThanhVien']);

            //Route thống kê khách hàng mới
            Route::get('/khach-hang-moi-theo-tung-thang', [ThongKeKhachHangController::class, 'thongKeKhachHangMoi']);
            Route::get('/khach-hang-quay-lai-theo-thang', [ThongKeKhachHangController::class, 'thongKeKhachHangQuayLaiTheoThang']);


            Route::post('/tim-kiem-thanh-vien-theo-hang', [ThongKeKhachHangController::class, 'timKiemThanhVienTheoHang']);

            // Thống kê đánh giá
            Route::get('/{sanpham}/thong-ke-danh-gia', [ThongKeDanhGiaController::class, 'danhSachDanhGiaTheoSanPham']);
        });

        // Lich su hoat dong

        Route::get('/lich-su-hoat-dong', [LichSuHoatDongController::class, 'index']);
        Route::get('/lich-su-hoat-dong/{id}', [LichSuHoatDongController::class, 'show']);
    });
