import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu không chính xác" }),
});

export const registerSchema = z
  .object({
    ten: z.string().min(2, { message: "Vui lòng nhập Họ" }),
    ho: z.string().min(2, { message: "Vui lòng nhập Tên" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })

      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" }),
    password_confirmation: z.string(),
    checkboxs: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu  không khớp",
    path: ["password_confirmation"],
  });
export const forgotpassword = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});
export const changePassword = z.object({
  password: z
  .string()
  .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })

  .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa" })
  .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" }),
password_confirmation: z.string(),
})
.refine((data) => data.password === data.password_confirmation, {
message: "Mật khẩu  không khớp",
path: ["password_confirmation"],
});
