<?php

namespace App\Exports;

use App\Models\SanPham;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SanPhamExports implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return SanPham::with([
            'danhMuc',
            'boSuuTap',
            'bienTheSanPham',
        ])->get();
    }
    public function headings(): array
    {
        return [
            'ID Sản Phẩm',
            'Tên Danh Mục',
            'Tên Sản Phẩm',
            'Mã Sản Phẩm',
            'Ảnh Sản Phẩm',
            'Giá Sản Phẩm',
            'Mô Tả Ngắn Sản Phẩm',
            'Mô Tả Chi Tiết Sản Phẩm',
            'Lượt Xem',
            'Bộ sưu tập',
            'Số Lượng',
            'Trạng Thái',
            'Ngày Tạo',
        ];
    }
    public function styles(Worksheet $sheet)
    {
        $sheet->getColumnDimension('A')->setWidth(20);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(30);
        $sheet->getColumnDimension('D')->setWidth(20);
        $sheet->getColumnDimension('E')->setWidth(30);
        $sheet->getColumnDimension('F')->setWidth(20);
        $sheet->getColumnDimension('G')->setWidth(50);
        $sheet->getColumnDimension('H')->setWidth(50);
        $sheet->getColumnDimension('I')->setWidth(20);
        $sheet->getColumnDimension('J')->setWidth(20);
        $sheet->getColumnDimension('K')->setWidth(10);
        $sheet->getColumnDimension('L')->setWidth(20);
        $sheet->getColumnDimension('M')->setWidth(20);
        $sheet->getStyle('A1:M1')->applyFromArray([
            'font' => ['bold' => true],
            'borders' => [
                'outline' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK,
                    'color' => ['argb' => '00000000'],
                ],
            ],
        ]);
        $sheet->getStyle('A2:M' . $sheet->getHighestRow())->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '00000000'],
                ],
            ],
        ]);
        $sheet->getDefaultRowDimension()->setRowHeight(20);
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function map($sanPham): array
    {
        $giaThap = $sanPham->bienTheSanPham->min(function ($bienTheSanPham) {
            return $bienTheSanPham->gia_ban ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_khuyen_mai_tam_thoi;
        });

        $giaCao = $sanPham->bienTheSanPham->max(function ($bienTheSanPham) {
            return $bienTheSanPham->gia_ban ?? $bienTheSanPham->gia_khuyen_mai ?? $bienTheSanPham->gia_khuyen_mai_tam_thoi;
        });

        $boSuuTap = $sanPham->boSuuTap->map(function ($boSuuTap) {
            return $boSuuTap->ten;
        })->implode(', ');
        return [
            $sanPham->id,
            $sanPham->danhMuc->ten_danh_muc == null ? 'Không có' : $sanPham->danhMuc->ten_danh_muc,
            $sanPham->ten_san_pham == null ? 'Không có' : $sanPham->ten_san_pham,
            $sanPham->ma_san_pham == null ? 'Không có' : $sanPham->ma_san_pham,
            $sanPham->anh_san_pham == null ? 'Không có' : $sanPham->anh_san_pham,
            number_format($giaThap, 0, ',', '.') . " - " . number_format($giaCao, 0, ',', '.'),
            $sanPham->mo_ta_ngan == null ? 'Không có' : $sanPham->mo_ta_ngan,
            $sanPham->noi_dung == null ? 'Không có' : $sanPham->noi_dung,
            $sanPham->luot_xem == 0 ? 'Không có lượt xem' : $sanPham->luot_xem,
            $sanPham->boSuuTap == null ? 'Không có' : $boSuuTap,
            $sanPham->bienTheSanPham->sum('so_luong') == null ? 0 : $sanPham->bienTheSanPham->sum('so_luong'),
            $sanPham->trang_thai == 1 ? 'Đang Kinh Doanh' : 'Ngừng Kinh Doanh',
            $sanPham->created_at->format('d/m/Y H:i:s'),
        ];
    }
}
