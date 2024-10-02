import { IUser } from "@/common/types/user";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotpassword } from "@/common/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import instance from "@/configs/auth";

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(forgotpassword),
  });
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (user: IUser) => {
      console.log(user);
      try {
        const res = await instance.post("/forgot-password", user);
        toast.success(" Gửi yêu cầu  thành công");
        nav(`/login`);
        // console.log(res);
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
  const onSubmit = (data: { email: string }) => {
    mutate(data as any);
  };
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
        <div className="mb-8">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-2">Quên Mật khẩu</h2>
        <p className="text-gray-600 mb-6">
          Nhập địa chỉ email đã đăng ký của bạn, chúng tôi sẽ gửi cho bạn một mã
          để đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="glowclothing24@example.com"
            />
            {errors.email?.message && (
              <p className="text-red-600">{errors.email?.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold"
          >
            Gửi Yêu Cầu
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
