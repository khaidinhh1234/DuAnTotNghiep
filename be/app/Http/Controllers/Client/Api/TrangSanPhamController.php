<?php

namespace App\Http\Controllers\Client\Api;

use App\Http\Controllers\Controller;
use App\Models\BienTheKichThuoc;
use App\Models\BienTheMauSac;
use App\Models\DanhMuc;
use App\Models\SanPham;
use App\Traits\LocSanPhamTrait;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TrangSanPhamController extends Controller
{
    use LocSanPhamTrait;
    // public function danhMucCha(Request $request)
    // {
    //     try {
    //         // Bắt đầu transaction
    //         DB::beginTransaction();
    //         // Lấy danh mục có cha_id là null
    //         $danhMucCha = DanhMuc::query()->whereNull('cha_id')->get();
    //         // Commit transaction nếu mọi thứ thành công
    //         DB::commit();

    //         return response()->json([
    //             'status' => true,
    //             'status_code' => 200,
    //             'message' => 'Lấy dữ liệu thành công.',
    //             'danhMucCha' => $danhMucCha,
    //         ], 200);
    //     } catch (\Exception $e) {
    //         // Rollback nếu có lỗi
    //         DB::rollBack();
    //         // Trả về lỗi
    //         return response()->json([
    //             'status' => false,
    //             'status_code' => 500,
    //             'message' => 'Đã có lỗi xảy ra khi lấy dự liệu.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    // public function mauSac(Request $request)
    // {
    //     try {
    //         // Bắt đầu transaction
    //         DB::beginTransaction();

    //         // Lấy tất cả màu sắc
    //         $mauSacs = BienTheMauSac::query()->get();
    //         $mauSacs->map(function ($mauSac) {
    //             $mauSac->setAttribute('so_luong_san_pham', $mauSac->sanPhams->groupBy('ten_san_pham')->count());
    //         });
    //         // Commit transaction nếu mọi thứ thành công
    //         DB::commit();

    //         return response()->json([
    //             'status' => true,
    //             'status_code' => 200,
    //             'message' => 'Lấy dữ liệu thành công.',
    //             'mauSac' => $mauSacs
    //         ], 200);
    //     } catch (\Exception $e) {
    //         // Rollback nếu có lỗi
    //         DB::rollBack();

    //         // Trả về lỗi
    //         return response()->json([
    //             'status' => false,
    //             'status_code' => 500,
    //             'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    // public function kichThuoc(Request $request)
    // {
    //     DB::beginTransaction();  // Bắt đầu transaction
    //     try {
    //         // Lấy tất cả màu sắc
    //         $kichThuoc = BienTheKichThuoc::query()->get();
    //         $kichThuoc->map(function ($kichThuoc) {
    //             $kichThuoc->setAttribute('so_luong_san_pham', $kichThuoc->sanPhams->groupBy('ten_san_pham')->count());
    //         });
    //         // Commit transaction nếu mọi thứ thành công
    //         DB::commit();

    //         return response()->json([
    //             'kichThuoc' => $kichThuoc
    //         ]);
    //     } catch (\Exception $e) {
    //         // Rollback nếu có lỗi
    //         DB::rollBack();

    //         // Trả về lỗi
    //         return response()->json([
    //             'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function layDanhMucMauSacKichThuoc(Request $request)
    {
        // $id = $request->get('id') ?? null;
        $loai = $request->get('loai') ?? null;
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Lấy danh mục cha và danh mục con
            $danhMuc = DanhMuc::with('children.children')->where('duong_dan', $loai)->get();

            // Lấy tất cả màu sắc theo đường dẫn của danh mục
            $mauSacs = BienTheMauSac::with(['sanPhams.danhMuc' => function ($query) use ($loai) {
                $query->where('duong_dan', $loai);
            }])->get()->filter(function ($mauSac) {
                return $mauSac->sanPhams->isNotEmpty();
            });

            // Lấy tất cả kích thước theo đường dẫn của danh mục và loại kích thước
            $kichThuoc = BienTheKichThuoc::with(['sanPhams.danhMuc' => function ($query) use ($loai) {
                $query->where('duong_dan', $loai);
            }]);
            $kichThuoc = $kichThuoc->get()->filter(function ($kichThuoc) {
                return $kichThuoc->sanPhams->isNotEmpty();
            });

            // Commit transaction nếu mọi thứ thành công
            DB::commit();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công.',
                'danhMucCha' => $danhMuc,
                'mauSac' => $mauSacs,
                'kichThuoc' => $kichThuoc
            ], 200);
        } catch (Exception $e) {
            // Rollback nếu có lỗi
            DB::rollBack();

            // Trả về lỗi
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Có lỗi xảy ra, vui lòng thử lại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function locSanPham(Request $request)
    {
        DB::beginTransaction(); // Bắt đầu giao dịch
        try {
            // Lấy các tham số lọc từ yêu cầu
            $loaiDanhMuc = $request->loai_danh_muc ?? null;
            $danhMucChaIds = $request->danh_muc_cha_ids ?? [];
            $danhMucConIds = $request->danh_muc_con_ids ?? [];
            $danhMucChauIds = $request->danh_muc_chau_ids ?? [];

            $mauSacIds = $request->mau_sac_ids ?? [];
            $kichThuocIds = $request->kich_thuoc_ids ?? [];
            $giaDuoi = $request->gia_duoi ?? null;
            $giaTren = $request->gia_tren ?? null;

            // Tạo truy vấn sản phẩm
            $query = SanPham::query()->where('trang_thai', 1)
            ->whereHas('danhMuc', function ($query) use ($loaiDanhMuc) {
                $query->where('duong_dan', $loaiDanhMuc);
            });

            // Lọc theo danh mục cha và con
            if (!empty($danhMucChaIds) || !empty($danhMucConIds) || !empty($danhMucChauIds)) {
                $query->whereHas('danhMuc', function ($query) use ($danhMucChaIds, $danhMucConIds, $danhMucChauIds) {
                    if (!empty($danhMucChaIds) && !empty($danhMucConIds) && !empty($danhMucChauIds)) {
                        $query->where(function ($query) use ($danhMucChaIds, $danhMucConIds, $danhMucChauIds) {
                            $query->whereIn('cha_id', $danhMucChaIds)
                                ->whereIn('id', $danhMucConIds)
                                ->orWhereIn('id', $danhMucChauIds);
                        });
                    } elseif (!empty($danhMucChaIds) && !empty($danhMucConIds)) {
                        $query->where(function ($query) use ($danhMucChaIds, $danhMucConIds) {
                            $query->whereIn('cha_id', $danhMucChaIds)
                                ->orWhereIn('id', $danhMucConIds);
                        });
                    } elseif (!empty($danhMucChaIds)) {
                        $query->whereIn('cha_id', $danhMucChaIds)
                            ->orWhereIn('id', $danhMucChaIds);
                    } elseif (!empty($danhMucConIds)) {
                        $query->whereIn('id', $danhMucConIds)
                            ->orWhereIn('cha_id', $danhMucConIds);
                    } elseif (!empty($danhMucChauIds)) {
                        $query->whereIn('id', $danhMucChauIds);
                    }
                });
            }

            // Lọc theo màu sắc
            if (!empty($mauSacIds) && is_array($mauSacIds)) {
                $query->whereHas('bienTheSanPham.mauBienThe', function ($query) use ($mauSacIds) {
                    $query->whereIn('id', $mauSacIds);
                });
            }

            // Lọc theo kích thước
            if (!empty($kichThuocIds) && is_array($kichThuocIds)) {
                $query->whereHas('bienTheSanPham.kichThuocBienThe', function ($query) use ($kichThuocIds) {
                    $query->whereIn('id', $kichThuocIds);
                });
            }

            if (!is_null($giaDuoi) && !is_null($giaTren)) {
                $query->whereHas('bienTheSanPham', function ($query) use ($giaDuoi, $giaTren) {
                    $query->where(function ($query) use ($giaDuoi, $giaTren) {
                        $query->whereBetween(DB::raw('COALESCE(gia_khuyen_mai_tam_thoi, gia_khuyen_mai, gia_ban)'), [$giaDuoi, $giaTren]);
                    });
                });
            }

            // Sửa lại phần tính giá để tránh lỗi SQL
            $query->select([
                'san_phams.id',
                'san_phams.ten_san_pham',
                'san_phams.duong_dan',
                'san_phams.anh_san_pham',
                'san_phams.hang_moi',
                DB::raw('MIN(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_thap_nhat'),
                DB::raw('MAX(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_cao_nhat'),

            ])
                ->join('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->groupBy('san_phams.id');

            // Lấy dữ liệu sản phẩm với thông tin biến thể
            $sanPhams = $query->with([
                'bienTheSanPham' => function ($query) {
                    $query->with(['anhBienThe', 'mauBienThe', 'kichThuocBienThe']);
                }
            ])->paginate(12);

            // Gộp thông tin màu sắc, kích thước và ảnh biến thể
            $sanPhams->getCollection()->transform(function ($sanPham) {
                $bienTheData = $sanPham->bienTheSanPham->map(function ($bienThe) {
                    $mauBienThe = $bienThe->mauBienThe;
                    $kichThuocBienThe = $bienThe->kichThuocBienThe;
                    $anhBienThe = $bienThe->anhBienThe->map(function ($anh) {
                        return [
                            'id' => $anh->id,
                            'bien_the_san_pham_id' => $anh->bien_the_san_pham_id,
                            'duong_dan_anh' => $anh->duong_dan_anh,
                            'created_at' => $anh->created_at,
                            'updated_at' => $anh->updated_at,
                            'deleted_at' => $anh->deleted_at,
                        ];
                    });

                    return [
                        'id' => $bienThe->id,
                        'san_pham_id' => $bienThe->san_pham_id,
                        'so_luong_bien_the' => $bienThe->so_luong_bien_the,
                        'ten_mau_sac' => $mauBienThe ? $mauBienThe->ten_mau_sac : null,
                        'ma_mau_sac' => $mauBienThe ? $mauBienThe->ma_mau_sac : null,
                        'kich_thuoc' => $kichThuocBienThe ? $kichThuocBienThe->kich_thuoc : null,
                        'gia_chua_giam' => $bienThe->gia_ban  ?? 0, // Thay đổi để đảm bảo không null
                        'gia_hien_tai' => $bienThe->gia_khuyen_mai_tam_thoi ?? $bienThe->gia_khuyen_mai ?? $bienThe->gia_ban ?? 0, // Ưu tiên theo thứ tự giá
                        'anh_bien_the' => $anhBienThe->toArray()
                    ];
                })->toArray();

                // Kiểm tra trạng thái yêu thích
                $trangThaiYeuthich = false;
                if (Auth::guard('api')->check()) {
                    $user = Auth::guard('api')->user();
                    $trangThaiYeuthich = $sanPham->khachHangYeuThich->contains('id', $user->id);
                }
                return [
                    'id' => $sanPham->id,
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'duong_dan' => $sanPham->duong_dan,
                    'anh_san_pham' => $sanPham->anh_san_pham,
                    'hang_moi' => $sanPham->hang_moi,
                    'gia_thap_nhat' => $sanPham->gia_thap_nhat,
                    'gia_cao_nhat' => $sanPham->gia_cao_nhat,
                    'bien_the' => $bienTheData,
                    'mau_sac_va_anh' => $sanPham->bienTheSanPham->map(function ($bienThe) {
                        $mauBienThe = $bienThe->mauBienThe;
                        $anhBienThe = $bienThe->anhBienThe->first();

                        return [
                            'ma_mau_sac' => $mauBienThe ? $mauBienThe->ma_mau_sac : null,
                            'ten_mau_sac' => $mauBienThe ? $mauBienThe->ten_mau_sac : null,
                            'hinh_anh' => $anhBienThe ? $anhBienThe->duong_dan_anh : null
                        ];
                    })->unique(function ($item) {
                        return $item['ma_mau_sac'];
                    })->values()->toArray(),
                    'trang_thai_yeu_thich' => $trangThaiYeuthich,
                    'kich_thuocs' => $sanPham->bienTheSanPham->map(function ($bienThe) {
                        $kichThuocBienThe = $bienThe->kichThuocBienThe;
                        return $kichThuocBienThe ? $kichThuocBienThe->kich_thuoc : null;
                    })->unique()->values()->toArray()
                ];
            });
            DB::commit(); // Giao dịch cam kết

            // Trả về kết quả
            return response()->json([
                'status' => true,
                'data' => $sanPhams
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // Hoàn tác nếu có lỗi
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function layTatCaSanPham(Request $request)
    {
        $danhmuc = $request->get('danh_muc', null);
        try {
            $soLuongSanPhamMoiTrang = $request->get('per_page', 8);
            // Nạp quan hệ khachHangYeuThich để kiểm tra trạng thái yêu thích
            $sanPhams = SanPham::with([
                'bienTheSanPham' => function ($query) {
                    $query->with(['mauBienThe', 'kichThuocBienThe', 'anhBienThe'])
                        ->select(
                            'id',
                            'san_pham_id',
                            'bien_the_mau_sac_id',
                            'bien_the_kich_thuoc_id',
                            'so_luong_bien_the',
                            'gia_ban',
                            'gia_khuyen_mai',
                            'gia_khuyen_mai_tam_thoi'
                        );
                },
                'khachHangYeuThich' // Nạp trước quan hệ khachHangYeuThich
            ])
                ->where('san_phams.trang_thai', 1)
                ->whereHas('danhMuc', function ($query) use ($danhmuc) {
                    if ($danhmuc) {
                        $query->where('duong_dan', $danhmuc);
                    }
                })
                ->select(
                    'san_phams.id',
                    'san_phams.ten_san_pham',
                    'san_phams.anh_san_pham',
                    'san_phams.created_at',
                    'san_phams.ma_san_pham',
                    'san_phams.duong_dan',
                    'san_phams.hang_moi'
                )
                ->addSelect([
                    DB::raw('MIN(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_thap_nhat'),
                    DB::raw('MAX(COALESCE(bien_the_san_phams.gia_khuyen_mai_tam_thoi, bien_the_san_phams.gia_khuyen_mai, bien_the_san_phams.gia_ban)) as gia_cao_nhat')
                ])
                ->leftJoin('bien_the_san_phams', 'san_phams.id', '=', 'bien_the_san_phams.san_pham_id')
                ->groupBy('san_phams.id')
                ->orderBy('san_phams.created_at', 'desc')
                ->paginate($soLuongSanPhamMoiTrang);

            $result = $sanPhams->map(function ($sanPham) {
                $mauSacVaAnh = $sanPham->bienTheSanPham->flatMap(function ($bienThe) {
                    return $bienThe->anhBienThe->map(function ($anh) use ($bienThe) {
                        return [
                            'hinh_anh' => optional($bienThe->anhBienThe->first())->duong_dan_anh,
                            'ma_mau_sac' => optional($bienThe->mauBienThe)->ma_mau_sac,
                            'ten_mau_sac' => optional($bienThe->mauBienThe)->ten_mau_sac,
                        ];
                    });
                })->unique('ma_mau_sac')->values();

                $trangThaiYeuthich = false;
                if (Auth::guard('api')->check()) {
                    $user = Auth::guard('api')->user();
                    $trangThaiYeuthich = $sanPham->khachHangYeuThich->contains('id', $user->id);
                }

                return [
                    'id' => $sanPham->id,
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'duong_dan' => $sanPham->duong_dan,
                    'anh_san_pham' => $sanPham->anh_san_pham ?? 'default_image.jpg',
                    'hang_moi' => $sanPham->hang_moi,
                    'gia_thap_nhat' => $sanPham->gia_thap_nhat,
                    'gia_cao_nhat' => $sanPham->gia_cao_nhat,
                    'bien_the' => $sanPham->bienTheSanPham->map(function ($bienThe) {
                        return [
                            'id' => $bienThe->id,
                            'so_luong_bien_the' => $bienThe->so_luong_bien_the ?? 0,
                            'gia_ban' => $bienThe->gia_ban ?? 0,
                            'gia_khuyen_mai' => $bienThe->gia_khuyen_mai ?? $bienThe->gia_ban,
                            'gia_khuyen_mai_tam_thoi' => $bienThe->gia_khuyen_mai_tam_thoi ?? null,
                            'mau_sac' => $bienThe->mauBienThe->ten_mau_sac ?? 'Không xác định',
                            'kich_thuoc' => $bienThe->kichThuocBienThe->kich_thuoc ?? 'Không xác định',
                        ];
                    }),
                    'mau_sac_va_anh' => $mauSacVaAnh,
                    'trang_thai_yeu_thich' => $trangThaiYeuthich,
                ];
            });

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy tất cả sản phẩm thành công.',
                'data' => $result,
                'pagination' => [
                    'total' => $sanPhams->total(),
                    'current_page' => $sanPhams->currentPage(),
                    'last_page' => $sanPhams->lastPage(),
                    'per_page' => $sanPhams->perPage(),
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Có lỗi xảy ra khi lấy tất cả sản phẩm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function laySanPhamTheoDanhMuc($tenDanhMucCha, $tenDanhMucCon = null, $tenDanhMucConCapBa = null)
    {
        try {
            $danhMucCha = DanhMuc::query()->where('duong_dan', $tenDanhMucCha)->first();

            if (!$danhMucCha) {
                return response()->json(['message' => 'Không tìm thấy danh mục'], 404);
            }

            $sanPhams = null;
            if ($tenDanhMucCon) {
                $danhMucCon = DanhMuc::where('duong_dan', $tenDanhMucCon)->first();

                if (!$danhMucCon) {
                    return response()->json(['message' => 'Danh mục con không tồn tại'], 404);
                }

                if ($tenDanhMucConCapBa) {
                    $danhMucConCapBa = DanhMuc::where('duong_dan', $tenDanhMucConCapBa)->first();

                    if (!$danhMucConCapBa) {
                        return response()->json(['message' => 'Danh mục con cấp ba không tồn tại'], 404);
                    }

                    $sanPhams = SanPham::where('danh_muc_id', $danhMucConCapBa->id);
                } else {
                    $danhMucConIds = DanhMuc::where('cha_id', $danhMucCon->id)->pluck('id');
                    $sanPhams = SanPham::whereIn('danh_muc_id', $danhMucConIds);
                }
            } else {
                $danhMucIds = $this->layDanhMucIds($danhMucCha);
                $sanPhams = SanPham::whereIn('danh_muc_id', $danhMucIds);
            }

            $result = $sanPhams->get();

            return response()->json([
                'status' => true,
                'status_code' => 200,
                'message' => 'Lấy dữ liệu thành công',
                'data' => [
                    'Danh_muc' => [
                        'id' => $danhMucCha->id,
                        'ten_danh_muc' => $danhMucCha->ten_danh_muc,
                        'cha_id' => $danhMucCha->cha_id,
                        'anh_danh_muc' => $danhMucCha->anh_danh_muc,
                        'duong_dan' => $danhMucCha->duong_dan,
                        'children' => $danhMucCha->children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'ten_danh_muc' => $child->ten_danh_muc,
                                'cha_id' => $child->cha_id,
                                'anh_danh_muc' => $child->anh_danh_muc,
                                'duong_dan' => $child->duong_dan,
                                'created_at' => $child->created_at,
                                'updated_at' => $child->updated_at,
                                'deleted_at' => $child->deleted_at,
                                'children' => $child->children,
                            ];
                        }),
                    ],
                    'San_pham' => $result,
                ],
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'status' => false,
                'status_code' => 500,
                'message' => 'Đã có lỗi xảy ra khi lấy dữ liệu',
                'error' => $exception->getMessage()
            ], 500);
        }
    }


    // Hàm đệ quy để lấy tất cả ID danh mục con
    protected function layDanhMucIds($danhMuc)
    {
        $ids = [$danhMuc->id];
        foreach ($danhMuc->children as $child) {
            $ids = array_merge($ids, $this->layDanhMucIds($child));
        }
        return $ids;
    }
}
