export interface IUser {
  _id?: number | string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
  avatar?: string;
  address?: string;
  role?: "admin" | "member" | "guest";
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  checkboxs: boolean;
}
