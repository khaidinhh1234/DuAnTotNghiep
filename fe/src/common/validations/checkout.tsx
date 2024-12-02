import { z } from "zod";

export const checkout_address = z.object({
  ten_nguoi_dat_hang: z
    .string()
    .min(2, { message: "Vui lòng nhập Tên người nhận hàng" })
    .max(50, { message: "Tên không được quá 50 ký tự" }),
  so_dien_thoai_nguoi_dat_hang: z
    .string()
    .regex(/^\d+$/, { message: "Vui lòng nhập số điện thoại người nhận hàng" }) // Ensures numeric string
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" })
    .max(11, { message: "Số điện thoại không được quá 11 ký tự" }),
  email_nguoi_dat_hang: z.string().email({
    message: "Vui lòng nhập Email hợp lệ",
  }),
  dia_chi_nguoi_dat_hang: z
    .string()
    .min(2, { message: "Vui lòng nhập Địa chỉ nhận hàng lớn hơn 2 ký tự" }),

  ghi_chu: z.string(),
});
