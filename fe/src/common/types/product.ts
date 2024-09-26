import { UploadFile } from "antd/es/upload/interface";

export interface ColorData {
  id: number | string;
  ten_mau_sac: string;
}

export interface SizeData {
  id: number | string;
  kich_thuoc: string;
}

export interface Variant {
  id: string;
  mau_sac_id: number;
  kich_thuoc_id: number;
  gia_ban: string;
  gia_khuyen_mai: string;
  so_luong_bien_the: string;
  ngay_bat_dau_khuyen_mai: Date | null;
  ngay_ket_thuc_khuyen_mai: Date | null;
  anh_bien_the: UploadFile[];
}
export interface VariantPull {
  [key: string]: any;
}

export interface VariantFormProps {
  variants: Variant[];
  updateVariant: (variant: Variant) => void;
  handleRemoveImage: (file: UploadFile, variant: Variant) => void;
  handleImageChange: (info: any, variant: Variant) => void;
  colorsData: ColorData[];
  sizesData: SizeData[];
}

export interface Category {
  id: number;
  ten_danh_muc: string;
}

export interface Tag {
  id: number;
  ten_the: string;
}



export interface Size {
  id: number;
  kich_thuoc: string;
}

export interface Color {
  id: number;
  ten_mau_sac: string;
  ma_mau_sac: string;
}



export interface VariantType {
  type: 'color' | 'size';
  values: number[];
}


export interface ProductFormData {
  ten_san_pham: string;
  mo_ta_san_pham: string;
  danh_muc_id: number;
  mo_ta_ngan: string;
  ma_san_pham: string;
  noi_dung: string
  tags: number[];
  anh_san_pham: UploadFile[];

}
export interface IColor {
  id?: string;
  ten_mau_sac: string;
  ma_mau_sac: string;
}

export type ColorResponse = {
  data: IColor;
  message: string;
  status: number;
}

export type ColorParams = {
  id: string;
}

export type ColorFormValues = Omit<IColor, 'id'>;

export type UpdateColorMutationFn = (values: ColorFormValues) => Promise<ColorResponse>;

export type FetchColorQueryFn = () => Promise<ColorResponse>;
