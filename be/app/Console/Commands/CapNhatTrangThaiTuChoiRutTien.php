<?php

namespace App\Console\Commands;

use App\Models\YeuCauRutTien;
use Illuminate\Console\Command;

class CapNhatTrangThaiTuChoiRutTien extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cap-nhat-trang-thai-tu-choi-rut-tien';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $yeuCauRutTiens = YeuCauRutTien::where('trang_thai', 'cho_duyet')
            ->where('created_at',  "<", now()->subHours(24))
            ->get();

        foreach ($yeuCauRutTiens as $yeuCauRutTien) {
            $yeuCauRutTien->update([
                'trang_thai' => 'tu_choi'
            ]);
        }
    }
}
