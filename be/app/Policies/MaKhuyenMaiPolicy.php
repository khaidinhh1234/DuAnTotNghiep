<?php

namespace App\Policies;

use App\Models\User;
use App\Models\MaKhuyenMai;

class MaKhuyenMaiPolicy
{
    /**
     * Determine if the user can listen to the broadcast channel.
     *
     * @param  \App\Models\User  $user
     * @param  array  $hangThanhVienIds
     * @return bool
     */
    public function join(User $user, array $hangThanhVienIds)
    {
        // Kiểm tra xem hạng thành viên của user có trong danh sách $hangThanhVienIds hay không
        return in_array($user->hang_thanh_vien_id, $hangThanhVienIds);
    }
}
