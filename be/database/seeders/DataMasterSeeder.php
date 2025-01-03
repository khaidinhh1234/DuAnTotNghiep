<?php

namespace Database\Seeders;

use App\Models\AnhBienThe;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\DanhMuc;
use App\Models\DanhMucTinTuc;
use App\Models\DonHang;
use App\Models\HangThanhVien;
use App\Models\Quyen;
use App\Models\User;
use App\Models\VaiTro;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

class DataMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hạng thành viên
        $hangThanhViens = [
            [
                'ten_hang_thanh_vien' => 'Thành Viên Mới',
                'anh_hang_thanh_vien' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/game-level-icons-medals-stars-ui-badges-trophy_l6e7b2.png',
                'chi_tieu_toi_thieu' => 0,
                'chi_tieu_toi_da' => 100000,
                'ngay_bat_dau' => Carbon::now(),
                'ngay_ket_thuc' => Carbon::now()->addMonths(3),
                'mo_ta' => 'Thành viên mới',
            ],
            [
                'ten_hang_thanh_vien' => 'Đồng',
                'anh_hang_thanh_vien' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/3465_a0djdb.png',
                'chi_tieu_toi_thieu' => 100001,
                'chi_tieu_toi_da' => 500000,
                'ngay_bat_dau' => Carbon::now(),
                'ngay_ket_thuc' => Carbon::now()->addMonths(3),
                'mo_ta' => 'Hạng Đồng',
            ],
            [
                'ten_hang_thanh_vien' => 'Bạc',
                'anh_hang_thanh_vien' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/game-level-icons-medals-stars-ui-badges-trophy_1_23423234_qrrr8t.png',
                'chi_tieu_toi_thieu' => 500001,
                'chi_tieu_toi_da' => 1000000,
                'ngay_bat_dau' => Carbon::now(),
                'ngay_ket_thuc' => Carbon::now()->addMonths(3),
                'mo_ta' => 'Hạng Bạc',
            ],
            [
                'ten_hang_thanh_vien' => 'Vàng',
                'anh_hang_thanh_vien' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/1234_jqg5vd.png',
                'chi_tieu_toi_thieu' => 1000001,
                'chi_tieu_toi_da' => 5000000,
                'ngay_bat_dau' => Carbon::now(),
                'ngay_ket_thuc' => Carbon::now()->addMonths(3),
                'mo_ta' => 'Hạng Vàng',
            ],
        ];
        foreach ($hangThanhViens as $hangThanhVien) {
            HangThanhVien::create([
                'ten_hang_thanh_vien' => $hangThanhVien['ten_hang_thanh_vien'],
                'anh_hang_thanh_vien' => $hangThanhVien['anh_hang_thanh_vien'],
                'chi_tieu_toi_thieu' => $hangThanhVien['chi_tieu_toi_thieu'],
                'chi_tieu_toi_da' => $hangThanhVien['chi_tieu_toi_da'],
                'ngay_bat_dau' => $hangThanhVien['ngay_bat_dau'],
                'ngay_ket_thuc' => $hangThanhVien['ngay_ket_thuc'],
                'mo_ta' => $hangThanhVien['mo_ta'],
            ]);
        }

        // Vai trò
        $vaiTros = [
            [
                'ten_vai_tro' => 'Khách hàng',
                'mo_ta' => 'Khách hàng mua hàng',
            ],
            [
                'ten_vai_tro' => 'Quản trị viên',
                'mo_ta' => 'Quản trị viên hệ thống',
            ],
            [
                'ten_vai_tro' => 'Người giao hàng',
                'mo_ta' => 'Người giao hàng',
            ],
        ];

        foreach (Route::getRoutes() as $route) {
            $name = $route->getName();

            if (!$name || strpos($name, 'admin') === false || $name === 'admin.') {
                continue;
            }

            // array_push($mangQuyen, $name);

            Quyen::create([
                'ten_quyen' => $name,
            ]);
        }

        $quyenIds = Quyen::all()->pluck('id')->toArray();
        foreach ($vaiTros as $vaiTro) {
            if ($vaiTro['ten_vai_tro'] === 'Quản trị viên') {
                $role = VaiTro::create([
                    'ten_vai_tro' => $vaiTro['ten_vai_tro'],
                    'mo_ta' => $vaiTro['mo_ta'],
                ]);
                $role->quyens()->sync($quyenIds);
            } elseif ($vaiTro['ten_vai_tro'] === 'Khách hàng') {
                $role = VaiTro::create([
                    'ten_vai_tro' => $vaiTro['ten_vai_tro'],
                    'mo_ta' => $vaiTro['mo_ta'],
                ]);
                $role->quyens()->sync([]);
            } else {
                $quyenVanChuyenIds = Quyen::whereIn('ten_quyen', [
                    'admin.vanchuyen.index',
                    'admin.vanchuyen.show',
                    'admin.vanchuyen.ttvc',
                    'admin.vanchuyen.xacnhan',
                ])->pluck('id')->toArray();
                $role = VaiTro::create([
                    'ten_vai_tro' => $vaiTro['ten_vai_tro'],
                    'mo_ta' => $vaiTro['mo_ta'],
                ]);
                $role->quyens()->sync($quyenVanChuyenIds);
            }
        }

        //Danh mục
        $DanhMucs = [
            [
                'ten_danh_muc' => 'Nam',
                'cha_id' => null,
                'duong_dan' => 'nam',
            ],
            [
                'ten_danh_muc' => 'Nữ',
                'cha_id' => null,
                'duong_dan' => 'nu',
            ],
            [
                'ten_danh_muc' => 'Trẻ em',
                'cha_id' => null,
                'duong_dan' => 'tre-em',
            ],
            [
                'ten_danh_muc' => 'Áo polo',
                'cha_id' => 1,
                'duong_dan' => 'ao_polo',
            ],
            [
                'ten_danh_muc' => 'Áo khoác',
                'cha_id' => 1,
                'duong_dan' => 'ao_khoac',
            ],
        ];

        foreach ($DanhMucs as $DanhMuc) {
            DanhMuc::create([
                'ten_danh_muc' => $DanhMuc['ten_danh_muc'],
                'cha_id' => $DanhMuc['cha_id'],
                'duong_dan' => $DanhMuc['duong_dan'],
            ]);
        }

        //Danh mục tin tức
        $DanhMucTinTucs = [
            [
                'ten_danh_muc_tin_tuc' => 'Dịch vụ khách hàng',
                'mo_ta' => 'Dịch vụ khách hàng',
                'hinh_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/3465_a0djdb.png',
                'duong_dan' => 'dich_vu_khach_hang',
            ],
            [
                'ten_danh_muc_tin_tuc' => 'Về chúng tôi',
                'mo_ta' => 'Dịch vụ khách hàng',
                'hinh_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729310626/3465_a0djdb.png',
                'duong_dan' => 've_chung_toi',
            ],
        ];

        foreach ($DanhMucTinTucs as $DanhMucTinTuc) {
            DanhMucTinTuc::create([
                'ten_danh_muc_tin_tuc' => $DanhMucTinTuc['ten_danh_muc_tin_tuc'],
                'duong_dan' => $DanhMucTinTuc['duong_dan'],
            ]);
        }

        //Màu sắc
        $mauSac = [
            [
                'ten_mau_sac' => 'Đỏ',
                'ma_mau_sac' => '#FF0000',
            ],
            [
                'ten_mau_sac' => 'Xanh',
                'ma_mau_sac' => '#0000FF',
            ],
            [
                'ten_mau_sac' => 'Vàng',
                'ma_mau_sac' => '#FFFF00',
            ],
            [
                'ten_mau_sac' => 'Trắng',
                'ma_mau_sac' => '#FFFFFF',
            ],
            [
                'ten_mau_sac' => 'Đen',
                'ma_mau_sac' => '#000000',
            ],
        ];

        foreach ($mauSac as $mau) {
            BienTheMauSac::create([
                'ten_mau_sac' => $mau['ten_mau_sac'],
                'ma_mau_sac' => $mau['ma_mau_sac'],
            ]);
        }

        $maleSizes = [
            [
                'kich_thuoc' => 'S',
                'loai_kich_thuoc' => 'nam',
                'chieu_cao_toi_thieu' => 170,
                'chieu_cao_toi_da' => 175,
                'can_nang_toi_thieu' => 60,
                'can_nang_toi_da' => 70,
            ],
            [
                'kich_thuoc' => 'M',
                'loai_kich_thuoc' => 'nam',
                'chieu_cao_toi_thieu' => 175,
                'chieu_cao_toi_da' => 180,
                'can_nang_toi_thieu' => 70,
                'can_nang_toi_da' => 80,
            ],
            [
                'kich_thuoc' => 'L',
                'loai_kich_thuoc' => 'nam',
                'chieu_cao_toi_thieu' => 180,
                'chieu_cao_toi_da' => 185,
                'can_nang_toi_thieu' => 80,
                'can_nang_toi_da' => 90,
            ],
            [
                'kich_thuoc' => 'XL',
                'loai_kich_thuoc' => 'nam',
                'chieu_cao_toi_thieu' => 185,
                'chieu_cao_toi_da' => 190,
                'can_nang_toi_thieu' => 90,
                'can_nang_toi_da' => 100,
            ],
        ];

        // Sample data for female sizes
        $femaleSizes = [
            [
                'kich_thuoc' => 'XS',
                'loai_kich_thuoc' => 'nu',
                'chieu_cao_toi_thieu' => 150,
                'chieu_cao_toi_da' => 155,
                'can_nang_toi_thieu' => 40,
                'can_nang_toi_da' => 50,
            ],
            [
                'kich_thuoc' => 'S',
                'loai_kich_thuoc' => 'nu',
                'chieu_cao_toi_thieu' => 155,
                'chieu_cao_toi_da' => 160,
                'can_nang_toi_thieu' => 50,
                'can_nang_toi_da' => 60,
            ],
            [
                'kich_thuoc' => 'M',
                'loai_kich_thuoc' => 'nu',
                'chieu_cao_toi_thieu' => 160,
                'chieu_cao_toi_da' => 165,
                'can_nang_toi_thieu' => 60,
                'can_nang_toi_da' => 70,
            ],
            [
                'kich_thuoc' => 'L',
                'loai_kich_thuoc' => 'nu',
                'chieu_cao_toi_thieu' => 165,
                'chieu_cao_toi_da' => 170,
                'can_nang_toi_thieu' => 70,
                'can_nang_toi_da' => 80,
            ],
        ];

        // Sample data for children sizes
        $childrenSizes = [
            [
                'kich_thuoc' => 'XS',
                'loai_kich_thuoc' => 'tre_em',
                'chieu_cao_toi_thieu' => 100,
                'chieu_cao_toi_da' => 110,
                'can_nang_toi_thieu' => 20,
                'can_nang_toi_da' => 25,
            ],
            [
                'kich_thuoc' => 'S',
                'loai_kich_thuoc' => 'tre_em',
                'chieu_cao_toi_thieu' => 110,
                'chieu_cao_toi_da' => 120,
                'can_nang_toi_thieu' => 25,
                'can_nang_toi_da' => 30,
            ],
            [
                'kich_thuoc' => 'M',
                'loai_kich_thuoc' => 'tre_em',
                'chieu_cao_toi_thieu' => 120,
                'chieu_cao_toi_da' => 130,
                'can_nang_toi_thieu' => 30,
                'can_nang_toi_da' => 35,
            ],
            [
                'kich_thuoc' => 'L',
                'loai_kich_thuoc' => 'tre_em',
                'chieu_cao_toi_thieu' => 130,
                'chieu_cao_toi_da' => 140,
                'can_nang_toi_thieu' => 35,
                'can_nang_toi_da' => 40,
            ],
        ];

        // Insert all sizes into the database
        foreach ($maleSizes as $size) {
            BienTheKichThuoc::create($size);
        }

        foreach ($femaleSizes as $size) {
            BienTheKichThuoc::create($size);
        }

        foreach ($childrenSizes as $size) {
            BienTheKichThuoc::create($size);
        }

        $admin = User::create([
            'ho' => 'Quản',
            'ten' => 'Trị',
            'email' => 'chiduc1611@gmail.com',
            'anh_nguoi_dung' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729485508/Avatar-trang-den_apceuv.png',
            'password' => Hash::make('Admin1234'), // Mã hóa mật khẩu
            'so_dien_thoai' => '0123456789',
            'dia_chi' => '123 Đường ABC, TP XYZ',
            'ngay_sinh' => Carbon::parse('1990-01-01'),
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $user = User::create([
            'ho' => 'Nguyễn Chí',
            'ten' => 'Đức',
            'email' => 'ducncph32766@fpt.edu.vn',
            'anh_nguoi_dung' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729485508/Avatar-trang-den_apceuv.png',
            'password' => Hash::make('User1234'), // Mã hóa mật khẩu
            'so_dien_thoai' => '0123456789',
            'dia_chi' => '123 Đường ABC, TP XYZ',
            'ngay_sinh' => Carbon::parse('1990-01-01'),
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('vi_tiens')->insert([
            'user_id' => $user->id,
            'so_du' => 0,
            'ma_xac_minh' => Hash::make('123456'),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        //shipper

        $shipper = User::create([
            'ho' => 'Nguyễn Văn',
            'ten' => 'A',
            'email' => 'nguyenvana@gmail.com',
            'anh_nguoi_dung' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729485508/Avatar-trang-den_apceuv.png',
            'password' => Hash::make('Ship1234'),
            'so_dien_thoai' => '0123456789',
            'dia_chi' => '123 Đường ABC, TP XYZ',
            'ngay_sinh' => Carbon::parse('1990-01-01'),
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $admin->vaiTros()->sync([2]);
        $user->vaiTros()->sync([1]);
        $shipper->vaiTros()->sync([3]);

        //Sản phẩm
        $sanPhams = [
            [
                'danh_muc_id' => 3,
                'ten_san_pham' => 'Áo polo nam mắt chim in tràn hình học',
                'anh_san_pham' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729909719/ao-polo-nam-apm5193-tra-1-yodyvn_pxx7d7.webp',
                'ma_san_pham' => 'APM5193-TRA-3XL',
                'duong_dan' => 'ao-polo-nam-mat-chim-in-tran-hinh-hoc',
                'mo_ta_ngan' => 'Tạo ấn tượng mới với thiết kế áo polo nam phối màu trẻ trung, hiện đại. Thiết kế dáng áo cơ bản những phần cổ được xử lý tinh tế hơn. Phối màu hiện đại khiến chiếc áo polo nam của bạn không còn nhàm chán.',
                'noi_dung' => 'Áo polo nam mắt chim in tràn hình học',
                'luot_xem' => 0,
                'trang_thai' => 1,
                'gia_tot' => 0,
                'hang_moi' => 1,
            ],
            [
                'danh_muc_id' => 3,
                'ten_san_pham' => 'Áo Polo Nam In Vương Miện',
                'anh_san_pham' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729909929/ao-polo-nam-yody-apm6243-tny-qjm6065-xtu-3_o6otwd.webp',
                'ma_san_pham' => 'APM6243-TXR-M',
                'duong_dan' => 'ao-polo-nam-in-vuong-mien',
                'mo_ta_ngan' => 'Tạo ấn tượng mới với thiết kế áo polo nam phối màu trẻ trung, hiện đại. Thiết kế dáng áo cơ bản những phần cổ được xử lý tinh tế hơn. Phối màu hiện đại khiến chiếc áo polo nam của bạn không còn nhàm chán.',
                'noi_dung' => 'Áo Polo Nam In Vương Miện',
                'luot_xem' => 0,
                'trang_thai' => 1,
                'gia_tot' => 0,
                'hang_moi' => 1,
            ],
        ];

        foreach ($sanPhams as $sanPham) {
            $sanPham = \App\Models\SanPham::create([
                'danh_muc_id' => $sanPham['danh_muc_id'],
                'ten_san_pham' => $sanPham['ten_san_pham'],
                'anh_san_pham' => $sanPham['anh_san_pham'],
                'ma_san_pham' => $sanPham['ma_san_pham'],
                'duong_dan' => $sanPham['duong_dan'],
                'mo_ta_ngan' => $sanPham['mo_ta_ngan'],
                'noi_dung' => $sanPham['noi_dung'],
                'luot_xem' => $sanPham['luot_xem'],
                'trang_thai' => $sanPham['trang_thai'],
                'gia_tot' => $sanPham['gia_tot'],
                'hang_moi' => $sanPham['hang_moi'],
            ]);
        }

        //Biến thể sản phẩm

        $bienTheSanPhams = [
            [
                'san_pham_id' => 1,
                'bien_the_kich_thuoc_id' => 1,
                'bien_the_mau_sac_id' => 1,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 1,
                'bien_the_kich_thuoc_id' => 1,
                'bien_the_mau_sac_id' => 2,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 1,
                'bien_the_kich_thuoc_id' => 2,
                'bien_the_mau_sac_id' => 1,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 1,
                'bien_the_kich_thuoc_id' => 2,
                'bien_the_mau_sac_id' => 2,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 2,
                'bien_the_kich_thuoc_id' => 1,
                'bien_the_mau_sac_id' => 1,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 2,
                'bien_the_kich_thuoc_id' => 1,
                'bien_the_mau_sac_id' => 2,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 2,
                'bien_the_kich_thuoc_id' => 2,
                'bien_the_mau_sac_id' => 1,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
            [
                'san_pham_id' => 2,
                'bien_the_kich_thuoc_id' => 2,
                'bien_the_mau_sac_id' => 2,
                'so_luong_bien_the' => 100,
                'gia_ban' => 100000,
                'chi_phi_san_xuat' => 50000,
                'gia_khuyen_mai' => 90000,
            ],
        ];

        foreach ($bienTheSanPhams as $bienTheSanPham) {
            \App\Models\BienTheSanPham::create([
                'san_pham_id' => $bienTheSanPham['san_pham_id'],
                'bien_the_kich_thuoc_id' => $bienTheSanPham['bien_the_kich_thuoc_id'],
                'bien_the_mau_sac_id' => $bienTheSanPham['bien_the_mau_sac_id'],
                'so_luong_bien_the' => $bienTheSanPham['so_luong_bien_the'],
                'gia_ban' => $bienTheSanPham['gia_ban'],
                'chi_phi_san_xuat' => $bienTheSanPham['chi_phi_san_xuat'],
                'gia_khuyen_mai' => $bienTheSanPham['gia_khuyen_mai'],
            ]);
        }

        // Ảnh biến thể sản phẩm
        $anhBienThes = [
            [
                'bien_the_san_pham_id' => 1,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 1,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 1,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 1,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 2,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 2,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 2,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 2,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 3,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 3,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 3,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 3,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 4,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 4,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 4,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 4,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 5,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 5,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 5,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 5,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 6,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 6,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 6,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 6,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 7,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 7,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 7,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 7,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ],
            [
                'bien_the_san_pham_id' => 8,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-4_jvrbhu.webp',
            ],
            [
                'bien_the_san_pham_id' => 8,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347057/8tp24a005-sb067-xl-1-u_uqrhgh.webp',
            ],
            [
                'bien_the_san_pham_id' => 8,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-thumb_frzzg6.webp',
            ],
            [
                'bien_the_san_pham_id' => 8,
                'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729347056/8tp24a005-sb067-xl-2_dcar1k.webp'
            ]
        ];

        foreach ($anhBienThes as $anhBienThe) {
            AnhBienThe::create([
                'bien_the_san_pham_id' => $anhBienThe['bien_the_san_pham_id'],
                'duong_dan_anh' => $anhBienThe['duong_dan_anh'],
            ]);
        }

        //Đơn hàng
        DonHang::create([
            'user_id' => 2,
            'trang_thai_don_hang' => 'Chờ xác nhận',
            'phuong_thuc_thanh_toan' => 'Thanh toán khi nhận hàng',
            'tong_tien_don_hang' => 1000000,
            'trang_thai_thanh_toan' => 'Chưa thanh toán',
        ]);

        //Đơn hàng chi tiết
        DB::table('don_hang_chi_tiets')->insert([
            [
                'don_hang_id' => 1,
                'bien_the_san_pham_id' => 1,
                'so_luong' => 10,
                'gia' => 100000,
                'thanh_tien' => 1000000,
            ],
            [
                'don_hang_id' => 1,
                'bien_the_san_pham_id' => 5,
                'so_luong' => 10,
                'gia' => 100000,
                'thanh_tien' => 1000000,
            ],
        ]);

        DB::table('thong_tin_webs')->insert([
            'ten_website' => 'Glow Clothing',
            'logo_website' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729324186/LOGOGLOW_ogegpp.png',
            'ten_doanh_nghiep' => 'Glow Clothing',
            'dia_chi' => '13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội, Việt Nam',
            'email' => 'Glowclothing@gmail.com',
            'so_dien_thoai_dat_hang' => '0342278284',
            'so_dien_thoai_khieu_nai' => '0342278284',
            'cau_noi' => 'Glow Clothing - Nơi bạn tỏa sáng',
            'link_facebook' => 'https://facebook.com/example',
            'link_youtube' => 'https://youtube.com/example',
            'link_zalo' => 'https://zalo.me/example',
            'link_instagram' => 'https://instagram.com/example',
            'link_tiktok' => 'https://tiktok.com/@example',
            'banner' => json_encode([
                [
                    'id' => 1,
                    'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729482616/Banner_th%E1%BB%9Di_trang_3-min_gaxh9t.png',
                    'vi_tri' => 1,
                    'noi_dung' => [
                        'tieu_de_chinh' => 'Bộ vest ngắn nữ',
                        'mau_tieu_de_chinh' => '#000000',
                        'tieu_de_phu' => 'Bộ đồ ngắn của chúng tôi',
                        'mau_tieu_de_phu' => '#000000',
                        'van_ban_quang_cao' => 'là một món đồ thời trang hoàn hảo cho một bộ trang phục hoàn hảo để tạo nên vẻ ngoài sành điệu và hợp thời trang.',
                        'mau_van_ban_quang_cao' => '#000000',
                        'tieu_de_nut' => 'Mua ngay',
                        'mau_nut' => '#000000',
                        'duong_link' => 'https://example.com/link1'
                    ]
                ],
                [
                    'id' => 2,
                    'duong_dan_anh' => 'https://res.cloudinary.com/dpundwxg1/image/upload/v1729480274/Banner_th%E1%BB%9Di_trang_2-min_x2mtwk.png',
                    'vi_tri' => 2,
                    'noi_dung' => [
                        'tieu_de_chinh' => 'Bộ vest ngắn nữ',
                        'mau_tieu_de_chinh' => '#FFFFFF',
                        'tieu_de_phu' => 'Bộ đồ ngắn của chúng tôi',
                        'mau_tieu_de_phu' => '#FFFFFF',
                        'van_ban_quang_cao' => 'là một món đồ thời trang hoàn hảo cho một bộ trang phục hoàn hảo để tạo nên vẻ ngoài sành điệu và hợp thời trang.',
                        'mau_van_ban_quang_cao' => '#FFFFFF',
                        'tieu_de_nut' => 'Mua ngay',
                        'mau_nut' => '#FFFFFF',
                        'duong_link' => 'https://example.com/link2'
                    ]
                ]
            ]),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
