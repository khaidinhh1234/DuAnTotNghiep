import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),

  password: z
    .string()
    .min(6, { message: "Mật khẩu không chính xác" })
    .regex(/^\S+$/, { message: "Mật khẩu không đúng định dạng" }),
});

export const registerSchema = z
  .object({
    ten: z
      .string()
      .min(2, { message: "Vui lòng nhập Tên" })
      .regex(/^[^\s]+(\s[^\s]+)?$/, {
        message: "Vui lòng nhập đúng định dạng",
      }),
    ho: z
      .string()
      .min(2, { message: "Vui lòng nhập Họ" })
      .regex(/^[^\s]+(\s[^\s]+)?$/, {
        message: "Vui lòng nhập đúng định dạng",
      }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" })
      .regex(/^\S+$/, { message: "Mật khẩu không đúng định dạng" }),
    password_confirmation: z.string(),
    checkboxs: z.boolean(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["password_confirmation"],
  });
export const forgotpassword = z.object({
  email: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .regex(/^\S+$/, { message: "Vui lòng nhập đúng định dạng" }),
});
export const changePassword = z
  .object({
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })

      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" })
      .regex(/^\S+$/, { message: "Mật khẩu không đúng định dạng" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu  không khớp",
    path: ["password_confirmation"],
  });
