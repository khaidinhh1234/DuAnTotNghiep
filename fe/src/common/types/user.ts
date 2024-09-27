export interface IUser {
    id?: number | string;
    ho: string;
    ten: string;
    email: string;
    password: string;
    password_confirmation?: string;
    so_dien_thoai?: string;
    avatar?: string;
    dia_chi?: string;
    role?: "admin" | "member" | "guest";
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    checkboxs: boolean;
}
