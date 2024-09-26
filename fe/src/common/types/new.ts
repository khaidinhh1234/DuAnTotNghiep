export interface INew {
    id: number | string;
    user_id: string | number
    danh_muc_tin_tuc_id: number | string
    tieu_de: string,
    noi_dung: string,
    trang_thai: boolean,
    created_at: Date,
    updated_at: Date,
}
