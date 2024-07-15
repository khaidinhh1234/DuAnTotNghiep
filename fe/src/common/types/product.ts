export interface IProduct {
  _id?: number | string;
  name: string;
  category?: string;
  regular_price: number;
  quantity: number;
  feature_image: string;
  description: string;
  discount: number;
  sale_price: string;
  deletool: boolean;
  countIn_stock: number;
  gallery_images: string[];
}
