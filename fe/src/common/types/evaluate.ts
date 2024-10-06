export interface IEvaluate {
  user: any;
  san_pham: any;
  id: number ;
  user_id: string | number;
  san_pham_id: string | number;
  tong_so_sao_trung_binh: number
  so_sao_san_pham: number;
  so_sao_dich_vu_van_chuyen: number;
  chat_luong_san_pham: string;
  mo_ta: string;
  anh_danh_gias: string;
  phan_hoi: string;
  trang_thai: boolean;
  created_at: Date;
  updated_at: Date;
}
