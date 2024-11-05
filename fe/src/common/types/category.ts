export interface ICategories {
  ten: any;
  id?: number | string;
  ten_danh_muc: string;
  cha_id?: string | null;
  anh_danh_muc: string;
  duong_dan?: string;
  deletool?: boolean;
  created_at?: Date;
  updatedAt?: Date;
  children?: ICategories[];
}
