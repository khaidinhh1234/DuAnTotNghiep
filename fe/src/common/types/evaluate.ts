export interface IEvaluate {
    id: string | number,
    user_id: string | number,
    san_pham_id: string | number,
    so_sao_san_pham: number,
    so_sao_dich_vu_van_chuyen: number,
    noi_dung: string
    trang_thai: boolean,
    created_at: Date,
    updated_at: Date,
}