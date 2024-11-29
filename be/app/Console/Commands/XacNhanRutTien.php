<?php

namespace App\Console\Commands;

use App\Models\HoanTien;
use Illuminate\Console\Command;

class XacNhanRutTien extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:xac-nhan-rut-tien';

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
        $hoanTiens = HoanTien::where('trang_thai', 'cho_xac_nhan')
            ->where('created_at', '<', now()->subDays(1))
            ->get();
        foreach ($hoanTiens as $hoanTien) {
            $hoanTien->update([
                'trang_thai' => 'da_xac_nhan'
            ]);
        }
    }
}
