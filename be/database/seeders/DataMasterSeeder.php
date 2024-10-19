<?php

namespace Database\Seeders;

use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\DanhMuc;
use App\Models\DanhMucTinTuc;
use App\Models\HangThanhVien;
use App\Models\Quyen;
use App\Models\VaiTro;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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
                'duong_dan' => 'dich_vu_khach_hang',
            ],
            [
                'ten_danh_muc_tin_tuc' => 'Về chúng tôi',
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

        // Size
        $kichThuoc = [
            [
                'kich_thuoc' => 'S',
                'loai_kich_thuoc' => 'nam',
            ],
            [
                'kich_thuoc' => 'M',
                'loai_kich_thuoc' => 'nam',
            ],
            [
                'kich_thuoc' => 'L',
                'loai_kich_thuoc' => 'nam',
            ],
            [
                'kich_thuoc' => 'XL',
                'loai_kich_thuoc' => 'nam',
            ],
            [
                'kich_thuoc' => 'S',
                'loai_kich_thuoc' => 'nu',
            ],
            [
                'kich_thuoc' => 'M',
                'loai_kich_thuoc' => 'nu',
            ],
            [
                'kich_thuoc' => 'L',
                'loai_kich_thuoc' => 'nu',
            ],
            [
                'kich_thuoc' => 'XL',
                'loai_kich_thuoc' => 'nu',
            ],
            [
                'kich_thuoc' => '1',
                'loai_kich_thuoc' => 'tre_em',
            ],
            [
                'kich_thuoc' => '2',
                'loai_kich_thuoc' => 'tre_em',
            ],
            [
                'kich_thuoc' => '3',
                'loai_kich_thuoc' => 'tre_em',
            ],
            [
                'kich_thuoc' => '4',
                'loai_kich_thuoc' => 'tre_em',
            ]
        ];

        foreach ($kichThuoc as $size) {
            BienTheKichThuoc::create([
                'kich_thuoc' => $size['kich_thuoc'],
                'loai_kich_thuoc' => $size['loai_kich_thuoc'],
            ]);
        }
    }
}
