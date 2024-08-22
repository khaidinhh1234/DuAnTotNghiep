import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export const registerSchema = z.object({
  first_name: z.string().min(3, { message: 'Tên đầu tiên phải có ít nhất 3 ký tự' }),
  last_name: z.string().min(3, { message: 'Tên cuối cùng phải có ít nhất 3 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .regex(/[a-z]/, { message: 'Mật khẩu phải có ít nhất 1 chữ cái thường' })
    .regex(/[A-Z]/, { message: 'Tối thiểu 1 chữ cái hoa' })
    .regex(/[0-9]/, { message: 'Tối thiểu 1 số' }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"], 
});