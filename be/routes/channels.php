<?php

use App\Models\MaKhuyenMai;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
//
Broadcast::channel('thong-bao', function(){
    return true;
});
//
//Broadcast::channel('ma-khuyen-mai', function ($user, MaKhuyenMai $maKhuyenMai) {
//    return (new App\Policies\MaKhuyenMaiPolicy)->join($user, $maKhuyenMai->hang_thanh_vien_ids);
//});

//Broadcast::channel('users.{userId}', function ($user, $userId) {
//    return (int) $user->id === (int) $userId;
//});


