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
      .max(20, { message: "Không quá 20 ký tự" })

      .max(20, { message: "Không quá 20 ký tự" })
      .regex(/^[A-Za-zÀ-ỹ]+(?:\s[A-Za-zÀ-ỹ]+)?$/, {
        message: "Không chứa ký tự đặc biệt, số và dấu cách",
      }),
    ho: z
      .string()
      .min(2, { message: "Vui lòng nhập Họ" })
      .max(20, { message: "Không quá 20 ký tự" })
      .regex(/^[A-Za-zÀ-ỹ]+(?:\s[A-Za-zÀ-ỹ]+)?$/, {
        message: "Không chứa ký tự đặc biệt, số và dấu cách",
      }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái in hoa" })
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
export const lienhe = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),

  name: z
    .string()
    .min(5, { message: "Vui lòng nhập đầy đủ họ tên" })
    .max(30, { message: "Không quá 30 ký tự" })
    .regex(/^[A-Za-zÀ-ỹ]+(?:\s[A-Za-zÀ-ỹ]+)*$/, {
      message: "Không chứa ký tự đặc biệt, số và dấu cách",
    }),
  loai_lien_he: z.string(),
  noi_dung_lien_he: z
    .string()
    .min(1, { message: "Vui lòng nhập nội dung liên hệ" })
    .regex(/^\S.*\S$|^\S{1}$/, {
      message: "Nội dung liên hệ không được có khoảng trắng ở đầu hoặc cuối",
    }),
});
