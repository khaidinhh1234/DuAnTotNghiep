import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu không chính xác" }),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(2, { message: "Vui lòng nhập Họ" }),
    last_name: z.string().min(2, { message: "Vui lòng nhập Tên" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })

      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" }),
    confirmPassword: z.string(),
    checkboxs: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu  không khớp",
    path: ["confirmPassword"],
  });
