export interface ICategories {
    id?: number | string;
    ten_danh_muc: string;
    cha_id?: string | null;
    anh_danh_muc: string;
    duong_dan?: string;
    deletool?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    // children?: ICategories[];
}