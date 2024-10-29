import { z } from "zod";

export const checkout_address = z.object({
  name: z
    .string()
    .min(2, { message: "Vui lòng nhập Tên lớn hơn 2 ký tự" })
    .max(50, { message: "Tên không được quá 50 ký tự" }),
  mobileNumber: z
    .string()
    .regex(/^\d+$/, { message: "Số điện thoại chỉ bao gồm chữ số" }) // Ensures numeric string
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" })
    .max(11, { message: "Số điện thoại không được quá 11 ký tự" }),
  addressLine1: z.string().min(2, {
    message: "Vui lòng nhập Địa chỉ nhận hàng lớn hơn 2 ký tự",
  }),
  note: z.string().optional(),
});
