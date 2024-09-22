<?php

namespace App\Exports;

use App\Models\SanPham;
use Maatwebsite\Excel\Concerns\FromCollection;

class SanPhamExports implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return SanPham::all();
    }
}
