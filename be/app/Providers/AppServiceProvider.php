<?php

namespace App\Providers;

use App\Models\ChuongTrinhUuDai;
use App\Observers\ChuongTrinhUuDaiObserver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ChuongTrinhUuDai::observe(ChuongTrinhUuDaiObserver::class);
    }
}
