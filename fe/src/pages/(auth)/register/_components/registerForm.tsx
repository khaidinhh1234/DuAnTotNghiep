import { IUser } from "@/common/types/user";
import { registerSchema } from "@/common/validations/auth";

import instance from "@/configs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const SignupForm = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(registerSchema),
  });
  const { mutate } = useMutation({
    mutationFn: async (user: IUser) => {
      console.log(user);
      try {
        const res = await instance.post("http://localhost:3000/register", user);

        toast.success("Đăng ký thành công");
        nav("/login");
        console.log(res);
        return res.data;
      } catch (error: any) {
        console.log(error);
        if (error.response.data == "Email already exists") {
          toast.error("Email  đã tồn tại");
        } else {
          toast.error("Đăng ký thất bại");
        }
      }
    },
  });
  const onSubmit = (data: any) => {
    if (data.checkboxs == true) {
      mutate(data);
    } else {
      toast.error("Vui lòng đồng ý với điều khoản và điều kiện");
    }
  };
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-xl  shadow-black/20 rounded-lg">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Tạo Tài Khoản Mới
        </h2>
        <p className="text-gray-600 mb-6 text-xs text-center my-5">
          Trở thành thành viên GLOW <br />
          <span>để nhận nhiều những chương trình ưu đãi hấp dẫn,</span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Họ của bạn
              </label>
              <input
                type="text"
                className={`w-full p-3 border  rounded-md    ${errors.first_name?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
                placeholder="Robert"
                {...register("first_name", { required: true })}
              />
              {errors.first_name && (
                <p className="text-red-600">{errors.first_name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên của bạn
              </label>
              <input
                type="text"
                className={`w-full p-3 border  rounded-md   ${errors.last_name?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
                placeholder="Fox"
                {...register("last_name", { required: true })}
              />
              {errors.last_name && (
                <p className="text-red-600">{errors.last_name.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Địa chỉ Email
            </label>
            <input
              type="email"
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="robertfox@example.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md   ${errors.password?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="••••••••••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md   ${errors.confirmPassword?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="••••••••••••••••"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <p className="text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              className="mr-2"
              {...register("checkboxs")}
            />

            <span className="text-sm text-gray-600">
              Tôi đồng ý với{" "}
              <span className="font-semibold">Điều khoản & Điều kiện</span>
            </span>
          </div>
          <button
            type="submit"
            className="w-full my-5 bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold hover:scale-105 "
          >
            Đăng ký
          </button>
          <div className="text-center">
            Bạn đã có tài khoản?
            <a
              href="/login"
              className=" text-gray-900 my-4 pl-5 font-semibold "
            >
              Đăng nhập ngay <i className="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
