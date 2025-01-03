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
use App\Http\Controllers\Admin\api\HoanHangController;
use App\Http\Controllers\Admin\Api\SanPhamController;
use App\Http\Controllers\Admin\Api\TaiKhoanController;
use App\Http\Controllers\Admin\Api\ThongBaoTelegramController;
use App\Http\Controllers\Admin\Api\ThongKeDanhGiaController;
use App\Http\Controllers\Admin\Api\ThongKeDanhMuc;
use App\Http\Controllers\Admin\Api\ThongKeDoanhThuController;
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
use App\Http\Controllers\Client\Api\ThongBaoController;
use App\Http\Controllers\Client\Api\TrangChiTietSpController;
use App\Http\Controllers\Client\Api\TrangLienHeController;
use App\Http\Controllers\Client\Api\TrangChuController;
use App\Http\Controllers\Client\Api\TrangSanPhamController;
use App\Http\Controllers\Client\Api\MoMoController;
use App\Http\Controllers\Client\Api\TaiKhoanController as ApiTaiKhoanController;
use App\Http\Controllers\Client\Api\TinTucController as ApiTinTucController;
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
        Route::get('thong-tin-web', [TrangChuController::class, 'thongTinWeb']);
        Route::post('tim-kiem-goi-y', [TrangChuController::class, 'timKiemGoiY']);
        Route::get('load-danh-muc-con-chau/{id}', [TrangChuController::class, 'loadDanhMucConChau']);
        Route::get('load-danh-muc-cha', [TrangChuController::class, 'loadDanhMucSanPhamCha']);
        //Client Sản Phẩm
        // Client trang chi tiết sản phẩm
        Route::get('/chi-tiet-san-pham/{duong_dan}', [TrangChiTietSpController::class, 'chiTietSanPham']);
        Route::get('/danh-sach-san-pham-cung-loai/{id}', [TrangChiTietSpController::class, 'danhSachSanPhamCungLoai']);
        Route::post('goi-y-kich-thuoc', [TrangChiTietSpController::class, 'goiY']);
        Route::get('load-kick-thuoc', [TrangChiTietSpController::class, 'loadKichThuoc']);
        Route::get('/danh-muc-cha', [TrangChiTietSpController::class, 'danhMucCha']);
        //Trang sản phẩm
        // lấy tất cả sản phẩm
        Route::group([], function () {
            Route::get('lay-tat-ca-san-pham', [TrangSanPhamController::class, 'layTatCaSanPham']);
            //            Route::get('sanpham/danhmuc/{slug}', [TrangSanPhamController::class, 'laySanPhamTheoDanhMuc']);
            Route::post('danhmuc/{tenDanhMucCha}/{tenDanhMucCon?}/{tenDanhMucConCapBa?}', [App\Http\Controllers\Client\Api\DanhMucController::class, 'laySanPhamTheoDanhMuc']);
            Route::get('lay-dm-ms-kt', [TrangSanPhamController::class, 'layDanhMucMauSacKichThuoc']);
            // // Lấy ra danh mục cha


            // // Lấy ra màu sắc
            // Route::get('/mau-sac', [TrangSanPhamController::class, 'mauSac']);

            // // lấy kích thước
            // Route::get('/kich-thuoc', [TrangSanPhamController::class, 'kichThuoc'])->name('kich-thuoc');

            Route::post('/loc-san-pham', [TrangSanPhamController::class, 'locSanPham'])->name('loc-san-pham');
        })->middleware('throttle:60,1');


        // Client Tin tức
        Route::get('load-danh-muc-tin-tuc', [ApiTinTucController::class, 'loadDanhMucTinTucVaBaiViet']);
        Route::get('danhmuctintuc/{duongDan}', [ApiTinTucController::class, 'xemBaiVietTheoDanhMuc']);
        Route::post('xem-bai-viet/{duong_dan}', [ApiTinTucController::class, 'xemBaiViet']);

        //Thanh toán MoMo
        Route::post('/payment/momo', [MoMoController::class, 'thanhToanOnlineMomo']);
        Route::post('check-trang-thai', [MoMoController::class, 'checkDonHang']);
        Route::post('thanh-toan-lai', [MoMoController::class, 'thanhToanLai']);
        Route::post('luu-thanh-toan-vao-momo', [MoMoController::class, 'savePaymentInfo']);

        //Client Chi tiết sản phẩm
        // Captcha
        Route::get('captcha', [CaptchaController::class, 'generateCaptcha']);
        Route::post('captcha/verify', [CaptchaController::class, 'verifyCaptcha']);

        // Đánh giá
        Route::get('sanpham/{sanpham}/danhgia', [DanhGiaController::class, 'danhSachDanhGia']);
        Route::post('danhgia', [DanhGiaController::class, 'themMoiDanhGia']);

        // Liên hệ
        Route::post('lienhe', [TrangLienHeController::class, 'lienHe']);

        // Thích đánh giá
        Route::post('/danh-gia/{danhGia}/like', [TrangChiTietSpController::class, 'likeDanhGia']);
        Route::delete('/danh-gia/{danhGia}/unlike', [TrangChiTietSpController::class, 'boLikeDanhGia']);

        //Chương trình ưu đãi và
        Route::post('chuong-trinh-uu-dai/{slug}', [KhuyenMaiController::class, 'chiTietChuongTrinhUuDai']);
        Route::get('chuong-trinh-uu-dai', [KhuyenMaiController::class, 'danhSachChuongTrinhUuDai']);
        //        Route::post('danh-sach-loc', [App\Traits\LocSanPhamTrait::class, 'layDanhMucMauSacKichThuoc']);
        // Trang bộ sưu tập
        Route::get('bo-suu-tap/{slug}', [BoSuuTapController::class, 'show']);

        Route::middleware('auth.sanctum')->group(function () {
            // Xóa lịch xử tìm kiếm
            Route::delete('tim-kiem-goi-y/xoa-toan-bo', [TrangChuController::class, 'xoaLichSuTimKiem']);
            Route::delete('tim-kiem-goi-y/xoa/{id}', [TrangChuController::class, 'xoaMotLichSuTimKiem']);

            // Giỏ hàng
            Route::get('/gio-hang', [GioHangController::class, 'index']);
            Route::post('/gio-hang', [GioHangController::class, 'store']);
            Route::put('/gio-hang/tang-so-luong/{id}', [GioHangController::class, 'tangSoLuong']);
            Route::put('/gio-hang/giam-so-luong/{id}', [GioHangController::class, 'giamSoLuong']);
            Route::delete('/gio-hang/{id}', [GioHangController::class, 'destroy']);
            Route::put('/gio-hang/update/{id}', [GioHangController::class, 'update']);
            Route::post('/gio-hang/chon-san-pham', [GioHangController::class, 'updateSelection']);
            Route::get('/gio-hang/chi-tiet', [GioHangController::class, 'calculateTotal']);
            // Mã khuyến mãi
            Route::get('ma-khuyen-mai', [KhuyenMaiController::class, 'layMaKhuyenMaiTheoHangThanhVien']);
            Route::post('thu-thap-ma-khuyen-mai/{ma_code}', [KhuyenMaiController::class, 'thuThapMaKhuyenMai']);
            Route::get('ma-uu-dai-cho-nguoi-dung-cu-the', [KhuyenMaiController::class, 'danhSachMaKhuyenMaiTheoNguoiDung']);
            Route::get('tim-kiem-ma-khuyen-mai', [KhuyenMaiController::class, 'timKiemMaKhuyenMai']);
            Route::match(['post', 'get'], 'ma-uu-dai-theo-gio-hang', [KhuyenMaiController::class, 'danhSachMaKhuyenMaiTheoSanPhamGioHang']);
            Route::post('ap-dung-ma-khuyen-mai', [GioHangController::class, 'apDungMaGiamGia']);

            // Thông báo người dùng
            Route::get('thong-bao', [ThongBaoController::class, 'index']);
            Route::post('thong-bao/da-doc/{id}', [ThongBaoController::class, 'daXem']);
            Route::post('thong-bao/da-doc-tat-ca', [ThongBaoController::class, 'daXemTatCa']);

            // Đơn hàng
            Route::patch('/xac-nhan-don-hang/{ma_don_hang}', [DonHangClientController::class, 'xacNhanDonHang']);
            Route::post('don-hang/huy-don-hang', [DonHangClientController::class, 'huyDonHang']);
            Route::post('/danh-sach-don-hang', [DonHangClientController::class, 'donHangUser']);
            Route::get('/don-hang/{ma_don_hang}', [DonHangClientController::class, 'donHangUserDetail']);
            Route::post('/don-hang/hoan-hang/{ma_don_hang}', [DonHangClientController::class, 'hoanDonHang']);

            //Yêu cầu rút tiền
            Route::post('/rut-tien/{id}', [DonHangClientController::class, 'yeuCauRutTien']);

            Route::get('lich-su-tim-kiem', [TrangChuController::class, 'lichSuTimKiem']);
        });

        Route::group([], function () {
            //Sản phẩm yêu thích
            Route::get('sanpham/yeuthich', [SanPhamController::class, 'danhSachSanPhamYeuThich']);
            Route::post('sanpham/yeuthich/{id}', [SanPhamController::class, 'sanPhamYeuThich']);

            //Tài khoản
            Route::post('/cap-nhat-thong-tin', [ApiTaiKhoanController::class, 'CapNhatThongTin']);
            Route::match(['get', 'post'], '/vi-tai-khoan', [ApiTaiKhoanController::class, 'viTaiKhoan']);
            Route::post('/thiet-lap-ma-xac-minh', [ApiTaiKhoanController::class, 'thietLapMaXacMinh']);
            Route::get('/quen-ma-xac-minh', [ApiTaiKhoanController::class, 'quenMaXacMinh']);
            Route::post('/nap-tien', [ApiTaiKhoanController::class, 'napTienVi']);
            Route::post('xac-nhan-nap-tien', [ApiTaiKhoanController::class, 'xacNhanNapTien']);
            Route::get('/danh-sach-ngan-hang', [ApiTaiKhoanController::class, 'nganHangUser']);
            Route::post('/them-ngan-hang', [ApiTaiKhoanController::class, 'themTaiKhoanNganHang']);
            Route::post('/huy-lien-ket-ngan-hang/{id}', [ApiTaiKhoanController::class, 'huyLienKetNganHang']);
            Route::get('/momo-transactions', [ApiTaiKhoanController::class, 'getTransactionHistory']);
        })->middleware('auth.sanctum');


        Route::post('/don-hang', [DonHangClientController::class, 'taoDonHang']);
    });


//'auth.sanctum'
Route::middleware(['auth.sanctum'])
    ->name('admin.')
    ->prefix('admin')
    ->group(function () {
        // Danh muc
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('danhmuc', DanhMucController::class)->except(['show']);
                Route::get('danhmuc/thung-rac', [DanhMucController::class, 'danhSachDanhMucDaXoa'])->name('danhmuc.thungrac');
                Route::get('danhmuc/{id}', [DanhMucController::class, 'show'])->name('danhmuc.show');
                Route::post('danhmuc/thung-rac/{id}', [DanhMucController::class, 'khoiPhucDanhMuc'])->name('danhmuc.khoiphuc');
                Route::get('/xuatfile', [DanhMucController::class, 'exportDanhMuc'])->withoutMiddleware('auth.checkrole');
                Route::get('danhmuc/{id}', [DanhMucController::class, 'show'])->name('danhmuc.show');
                Route::get('danhmuc/loadAll', [DanhMucController::class, 'loadAll'])->name('danhmuc.loadAll');
            });

        // Sản phẩm
        Route::middleware('auth.checkrole')
            ->group(function () {

                Route::apiResource('sanpham', SanPhamController::class)->except(['show']);
                Route::patch('sanphams/khoi-phuc-xoa-mem-nhieu-san-pham', [SanPhamController::class, 'bulkRestore'])->name('sanpham.bulk-restore');
                Route::delete('sanpham', [SanPhamController::class, 'bulkDelete'])->name('sanpham.bulk-delete');
                Route::patch('sanphams/trang-thai-nhieu-san-pham', [SanPhamController::class, 'updateStatus'])->withoutMiddleware('auth.checkrole');
                Route::patch('sanphams/cap-nhat-nhieu-san-pham-the', [SanPhamController::class, 'bulkUpdateTags'])->name('sanpham.update-tags');
                Route::get('sanpham/exports', [SanPhamController::class, 'exportSanPham'])->withoutMiddleware('auth.checkrole');
                Route::post('sanpham/kich-hoat/{id}', [SanPhamController::class, 'kichHoatSanPham'])->name('sanpham.kichhoat');
                Route::post('sanpham/huy-kich-hoat/{id}', [SanPhamController::class, 'huyKichHoatSanPham'])->name('sanpham.huykichhoat');
                Route::get('sanpham/thung-rac', [SanPhamController::class, 'danhSachSanPhamDaXoa'])->name('sanpham.thungrac');
                Route::post('sanpham/thung-rac/{id}', [SanPhamController::class, 'khoiPhucSanPham'])->name('sanpham.khoiphuc');
                Route::get('sanpham/{id}', [SanPhamController::class, 'show'])->name('sanpham.show');
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
                Route::apiResource('bosuutap', BoSuuTapController::class)->except(['show']);
                Route::get('bosuutap/thung-rac', [BoSuuTapController::class, 'danhSachBoSuuTapDaXoa'])->name('bosuutap.thungrac');
                Route::post('bosuutap/thung-rac/{id}', [BoSuuTapController::class, 'khoiPhucBoSuuTap'])->name('bosuutap.khoiphuc');
                Route::get('bosuutap/{id}', [BoSuuTapController::class, 'show'])->name('bosuutap.show');
            });

        // Đánh giá
        Route::get('danhsachdanhgia', [AdminDanhGiaController::class, 'danhSachDanhGiaAll'])->name('danhgia.index')->middleware('auth.checkrole');
        Route::get('sanpham/{sanpham}/danhgia', [AdminDanhGiaController::class, 'DanhGiaTheoSanPham']);
        Route::post('danhsachdanhgia/{danhgia}', [AdminDanhGiaController::class, 'phanHoiDanhGia'])->name('danhgia.phanhoi')->middleware('auth.checkrole');
        Route::delete('an-danh-gia/{danhgia}', [AdminDanhGiaController::class, 'xoaDanhGia'])->name('danhgia.destroy');
        Route::get('danh-gia-bi-xoa', [AdminDanhGiaController::class, 'danhSachDanhGiaBiXoa'])->name('danhgia.thungrac');
        Route::post('danh-gia-khoi-phuc/{id}', [AdminDanhGiaController::class, 'khoiPhucDanhGia'])->name('danhgia.khoiphuc');

        // Đơn hàng
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::get('donhang', [DonHangController::class, 'index'])->name('donhang.index');
                Route::get('donhang/{id}', action: [DonHangController::class, 'show'])->name('donhang.show');
                Route::get('donhangchitiet/{ma_don_hang}', [DonHangController::class, 'showChiTiet'])->withoutMiddleware('auth.checkrole');
                Route::get('donhang/{id}/bill', [DonHangController::class, 'inHoaDon'])->name('donhang.bill')->withoutMiddleware('auth.checkrole');
                Route::put('donhang/trang-thai-thanh-toan', [DonHangController::class, 'updatePaymentStatus'])->name('donhang.tttt');
                Route::put('donhang/trang-thai-don-hang', [DonHangController::class, 'capNhatTrangThaiDonHang'])->name('donhang.ttdh');
                Route::get('donhang/export', [DonHangController::class, 'export'])->name('donhang.export');
                Route::get('donhanghoan', [DonHangController::class, 'hoanHang'])->name('donhang.hoanhang');
                Route::get('lay-thong-tin-don', [DonHangController::class, 'layThongTinDon'])->withoutMiddleware('auth.checkrole');
                Route::put('donhang/xac-nhan-hoan-hang/{id}', [DonHangController::class, 'xacNhanHoanHang'])->withoutMiddleware('auth.checkrole');
                Route::get('danh-sach-don-huy', [DonHangController::class, 'danhSachChoXacNhanHuyHang'])->withoutMiddleware('auth.checkrole');
                Route::put('donhang/xac-nhan-huy-hang/{id}', [DonHangController::class, 'xacNhanHuyHang'])->withoutMiddleware('auth.checkrole');
                Route::get('donhang/lay-thong-tin-don-hoan', [DonHangController::class, 'danhSachDonHangHoan']);
            });
        //Xác nhận rút tiền
        Route::get('danh-sach-yeu-cau-rut-tien', [DonHangController::class, 'danhSachYeuCauRutTien'])->name('rut-tien.index')->withoutMiddleware('auth.checkrole');
        Route::post('rut-tien/xac-nhan/{id}', [DonHangController::class, 'xacNhanYeuCauRutTien'])->name('rut-tien.xacnhan')->middleware('auth.checkrole');

        //Vận chuyển
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::get('vanchuyen', [VanChuyenController::class, 'index'])->name('vanchuyen.index');
                Route::get('vanchuyen/{id}', [VanChuyenController::class, 'show'])->name('vanchuyen.show');
                Route::put('vanchuyen/trang-thai-van-chuyen', [VanChuyenController::class, 'capNhatTrangThaiVanChuyen'])->name('vanchuyen.ttvc');
                Route::get('lay-thong-tin-van-chuyen', [VanChuyenController::class, 'layThongTinVanChuyen'])->withoutMiddleware('auth.checkrole');
                Route::put('vanchuyen/xac-nhan-van-chuyen/{id}', [VanChuyenController::class, 'xacNhanVanChuyen'])->name('vanchuyen.xacnhan');
                //Hoàn hàng
                Route::get('hoanhang/danh-sach', [HoanHangController::class, 'index'])->name('hoanhang.index');
                Route::get('hoanhang/chitiet/{id}', action: [HoanHangController::class, 'show'])->name('hoanhang.show');
                Route::put('hoanhang/xac-nhan-hoan-hang', [HoanHangController::class, 'capNhatTrangThaiHoanHang'])->name('hoanhang.tthh');
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
                Route::get('chuongtrinhuudai/san-pham-chua-co-uu-dai', [ChuongTrinhUuDaiController::class, 'getSanPhamChuaCoUuDai'])->name('chuongtrinhuudai.sanphamchuaco');
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
                Route::apiResource('taikhoan', TaiKhoanController::class)->except(['show', 'destroy']);
                Route::get('taikhoan/roles', [TaiKhoanController::class, 'danhSachVaiTro'])->withoutMiddleware('auth.checkrole');
                Route::get('taikhoan/thung-rac', [TaiKhoanController::class, 'danhSachTaiKhoanDaXoa'])->name('taikhoan.thungrac');
                Route::post('taikhoan/thung-rac/{id}', [TaiKhoanController::class, 'khoiPhucTaiKhoan'])->name('taikhoan.khoiphuc');
                Route::get('taikhoan/{id}', [TaiKhoanController::class, 'show'])->withoutMiddleware('auth.checkrole');
                Route::post('taikhoan/cap-nhat-mat-khau', [TaiKhoanController::class, 'doiMatKhau'])->withoutMiddleware('auth.checkrole');
                Route::post('taikhoan/{id}', [TaiKhoanController::class, 'destroy'])->name('taikhoan.destroy');
            });

        //Hạng thành viên
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::apiResource('hangthanhvien', HangThanhVienController::class)->except(['show']);
                Route::get('hangthanhvien/thung-rac', [HangThanhVienController::class, 'danhSachHangThanhVienDaXoa'])->name('hangthanhvien.thungrac');
                Route::post('hangthanhvien/thung-rac/{id}', [HangThanhVienController::class, 'khoiPhucHangThanhVien'])->name('hangthanhvien.khoiphuc');
                Route::get('hangthanhvien/{id}', [HangThanhVienController::class, 'show'])->name('hangthanhvien.show');
            });

        //        Route::middleware('auth.checkrole')
        //            ->group(function () {
        Route::get('thong-bao', [ThongBaoController::class, 'index'])->name('thongbao.index');
        Route::post('thong-bao/da-doc/{id}', [ThongBaoController::class, 'daXem']);
        //            });

        // Liên hệ
        Route::middleware('auth.checkrole')
            ->group(function () {
                Route::get('lien-he', [AdminLienHeController::class, 'danhSachLienHe'])->name('lienhe.index');
                Route::put('lien-he/{id}', [AdminLienHeController::class, 'phanHoi'])->name('lienhe.phanhoi');
            });

        //Vai trò auth.checkrole
        Route::middleware(['auth.checkrole'])
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
            Route::group([], function () {
                // Route::post('/huy-hang-theo-thang', [ThongKeTongQuanController::class, 'thongKeHuyHang']);
                // Route::post('don-hang/hoan-hang', [ThongKeTongQuanController::class, 'thongKeHoanHang']);
                // Route::post('san-pham/ton-kho', [ThongKeTongQuanController::class, 'thongKeTongSanPham']);
                // Route::post('don-hang/chot', [ThongKeTongQuanController::class, 'thongKeDonHangChot']);
                Route::post('tong-quan-theo-khoang1', [ThongKeTongQuanController::class, 'thongKeTongQuanTheoKhoang1']);
                Route::post('doanh-thu/tong', [ThongKeTongQuanController::class, 'thongKeDoanhThuTong']);
                Route::post('loi-nhuan', [ThongKeTongQuanController::class, 'thongKeLoiNhuan']);
                Route::post('doanh-thu/thanh-toan-online', [ThongKeTongQuanController::class, 'thongKeThanhToanOnline']);
                Route::post('doanh-thu/thanh-toan-off', [ThongKeTongQuanController::class, 'thongKeThanhToanOff']);
                Route::post('doanh-so-san-pham', [ThongKeTongQuanController::class, 'thongKeDoanhSoSanPham']);
                Route::post('doanh-thu/tb', [ThongKeTongQuanController::class, 'thongKeDoanhThuTB']);
                Route::post('don-hang/trang-thai', [ThongKeTongQuanController::class, 'trangThaiKhoangDonSoSanh']);
                Route::post('doanh-thu/so-sanh', [ThongKeTongQuanController::class, 'doanhThuTheoKhoang']);
                Route::post('doanh-thu-trang-thai', [ThongKeTongQuanController::class, 'thongKeTheoKhoangDoanhThuTrangThai']);

                Route::get('thanh-toan-tien-mat-theo-ngay', [ThongKeTongQuanController::class, 'thanhToanTienMatTheoNgay']);
                Route::get('thanh-toan-online-theo-ngay', [ThongKeTongQuanController::class, 'thanhToanOnlineTheoNgay']);
                Route::get('tong-quan-theo-ngay', [ThongKeTongQuanController::class, 'thongKeTongQuanTrongNgay']);
                Route::get('doanh-thu-loi-nhuan-theo-ngay', [ThongKeTongQuanController::class, 'doanhThuLoiNhuanRoi']);
                Route::get('doanh-thu-va-don-theo-ngay', [ThongKeTongQuanController::class, 'thongKeDoanhThuTrongNgay']);
            })->middleware('throttle:10,1');

            Route::get('/don-hang-theo-trang-thai', [ThongKeDonHangController::class, 'thongKeDonHangTheoTrangThai']);

            // Thống kê tuần tự
            Route::get('/doanh-thu-so-sanh', [ThongKeDoanhThuController::class, 'soSanhDoanhThuThang']);

            Route::get('/so-sanh-don-hang-thang', [ThongKeDonHangController::class, 'soSanhDonHangThang']);
            Route::get('/so-sanh-khach-hang-register', [ThongKeKhachHangController::class, 'soSanhKhachHangRegister']);
            Route::get('/so-sanh-khach-hang-block', [ThongKeKhachHangController::class, 'soSanhKhachHangBlock']);
            Route::post('/doanh-thu-tuan-tu', [ThongKeDoanhThuController::class, 'thongKeDoanhThuTuanTu']);
            Route::get('/top5-khach-hang-gan-day', [ThongKeKhachHangController::class, 'thongKeTop5KhachHangGanDay']);

            // Route thống kê sản phẩm
            Route::post('/top-san-pham', [ThongKeSanPham::class, 'thongKeTopSanPham']);
            Route::post('/doanh-thu-tung-san-pham', [ThongKeSanPham::class, 'thongKeDoanhThuTheoSanPham']);
            Route::post('/doanh-thu-theo-tung-san-pham', [ThongKeSanPham::class, 'thongKeDoanhThuTheoSanPham']);
            Route::get('/san-pham-ban-theo-thang', [ThongKeSanPham::class, 'sanPhamBanChayTheoThang']);
            Route::get('/san-pham-ban-theo-nam', [ThongKeSanPham::class, 'sanPhamBanChayTheoNam']);
            Route::get('/so-luong-ton-kho-cua-san-pham', [ThongKeSanPham::class, 'soLuongTonKhoCuaSanPham']);
            Route::get('/so-luong-san-pham-sap-het-hang', [ThongKeSanPham::class, 'soLuongSanPhamSapHetHang']);
            Route::post('/san-pham-all-time', [ThongKeSanPham::class, 'thongKeSanPhamAllTime']);

            //Route Thống kê hạng thành viên
            Route::get('/khach-hang-theo-hang-thanh-vien', [ThongKeKhachHangController::class, 'thongKeKhachHangTheoHangThanhVien']);
            Route::get('/khach-hang-moi-theo-hang', [ThongKeKhachHangController::class, 'thongKeKhachHangMoiTheoHangThanhVien']);

            //Route thống kê khách hàng
            Route::get('/khach-hang-moi-theo-tung-thang', [ThongKeKhachHangController::class, 'thongKeKhachHangMoi']);
            Route::get('/khach-hang-quay-lai-theo-thang', [ThongKeKhachHangController::class, 'thongKeKhachHangQuayLaiTheoThang']);
            Route::get('/khach-hang-do-tuoi', [ThongKeKhachHangController::class, 'thongKeDoTuoi']);
            Route::get('/rank-va-chi-tieu', [ThongKeKhachHangController::class, 'rankVaChiTieu']);
            Route::get('/khach-hang-all', [ThongKeKhachHangController::class, 'thongKeKhachHangAll']);
            Route::get('/top-10-khach-hang-tieu-bieu', [ThongKeKhachHangController::class, 'top10KhachHangTieuBieu']);

            Route::post('/tim-kiem-thanh-vien-theo-hang', [ThongKeKhachHangController::class, 'timKiemThanhVienTheoHang']);

            // Thống kê đánh giá
            Route::get('/{sanpham}/thong-ke-danh-gia', [ThongKeDanhGiaController::class, 'danhSachDanhGiaTheoSanPham']);
        });

        // Lich su hoat dong

        Route::get('/lich-su-hoat-dong', [LichSuHoatDongController::class, 'index']);
        Route::get('/lich-su-hoat-dong/{id}', [LichSuHoatDongController::class, 'show']);
    });
