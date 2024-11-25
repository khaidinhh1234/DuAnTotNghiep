<?php

namespace App\Exports;

use App\Models\DanhMuc;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;

class DanhMucExports implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return DanhMuc::with(['parent'])->get();
    }
    public function headings(): array
    {
        return [
            'ID Danh Mục',
            'Tên Danh Mục',
            'Danh Mục Cha',
            'Đường Dẫn',
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
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => ['bold' => true],
            'borders' => [
                'outline' => [
                    'borderStyle' => Border::BORDER_THICK,
                    'color' => ['argb' => '00000000'],
                ],
            ],
        ]);
        $sheet->getStyle('A2:E' . $sheet->getHighestRow())->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => '00000000'],
                ],
            ],
        ]);
        $sheet->getDefaultRowDimension()->setRowHeight(20);
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
    public function map($danhMuc): array
    {
        return [
            $danhMuc->id,
            $danhMuc->ten_danh_muc,
            $danhMuc->parent ? $danhMuc->parent->ten_danh_muc : 'Không có',
            $danhMuc->duong_dan,
            $danhMuc->created_at->format('d/m/Y'),
        ];
    }
}
