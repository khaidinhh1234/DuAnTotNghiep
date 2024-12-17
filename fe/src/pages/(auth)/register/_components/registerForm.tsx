import { IUser } from "@/common/types/user";
import { registerSchema } from "@/common/validations/auth";
import instanceauth from "@/configs/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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
      // console.log(user);
      try {
        const res = await instanceauth.post("/register", user);

        toast.success("Đăng ký thành công");
        nav("/login");
        console.log(res);
        return res.data;
      } catch (error: any) {
        // console.log(error);
        if (error.response.data == "Tài khoản đã tồn tại ") {
          toast.error("Tài khoản đã tồn tại");
        } else if (error.response.data.error.email[0] == "email đã tồn tại.") {
          toast.error("Email đã tồn tại");
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
        <p className="text-gray-600 mt-1 mb-6 text-xs text-center my-5">
          Trở thành thành viên Glow Clothing <br />
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
                className={`w-full p-3 border  rounded-md   ${errors.ho?.message ? "border-red-600 mt-1 placeholder-red-400" : "border-gray-300"}`}
                placeholder="Nhập họ của bạn"
                {...register("ho", { required: true })}
              />
              {errors.ho && (
                <p className="text-red-600 mt-1">{errors.ho?.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên của bạn
              </label>
              <input
                type="text"
                className={`w-full p-3 border  rounded-md    ${errors.ten?.message ? "border-red-600 mt-1 placeholder-red-400" : "border-gray-300"}`}
                placeholder="Nhập tên của bạn"
                {...register("ten", { required: true })}
              />
              {errors.ten && (
                <p className="text-red-600 mt-1">{errors.ten?.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tài khoản (Email)
            </label>
            <input
              type="email"
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 mt-1 placeholder-red-400" : "border-gray-300"}`}
              placeholder="glowclothing24@example.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md   ${errors.password?.message ? "border-red-600 mt-1 placeholder-red-400" : "border-gray-300"}`}
              placeholder="••••••••••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md   ${errors.password_confirmation?.message ? "border-red-600 mt-1 placeholder-red-400" : "border-gray-300"}`}
              placeholder="••••••••••••••••"
              {...register("password_confirmation", { required: true })}
            />
            {errors.password_confirmation && (
              <p className="text-red-600 mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              className="mr-2"
              {...register("checkboxs")}
            />

            <span className="text-sm text-gray-600 mt-1">
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
