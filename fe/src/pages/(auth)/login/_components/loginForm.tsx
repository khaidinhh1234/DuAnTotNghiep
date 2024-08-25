import { IUser } from "@/common/types/user";
import { loginSchema } from "@/common/validations/auth";
import instance from "@/configs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate } = useMutation({
    mutationFn: async (user: IUser) => {
      const { data } = await instance.post("/login", user);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("accessToken", data.accessToken);
      nav("/");
    },
  });
  const onSubmit = (data: any) => {
    mutate(data);
  };
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg border border-slate-100 h-auto">
        <h1 className="text-2xl font-bold mb-4 ">Chào Mừng 👋</h1>
        <p className="text-gray-600 mb-6 text-xs  my-5">
          Thành viên GLOW <br />
          <span>để nhận nhiều những chương trình ưu đãi hấp dẫn,</span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="robertfox@example.com"
              {...register("email", { required: true })}
            />
            {errors.email?.message && (
              <p className="text-red-600">{errors.email?.message}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="••••••••••••••••"
              {...register("password", { required: true })}
            />
            {errors.password?.message && (
              <p className="text-red-600">{errors.password?.message}</p>
            )}
          </div>
          <a
            href="/forgotpassword"
            className="block text-light text-gray-600 my-4 px-2 hover:underline"
          >
            Quên Mật Khẩu?
          </a>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 mb-6"
          >
            Đăng Nhập
          </button>
          <div className="text-center">
            Bạn chưa có tài khoản?
            <a
              href="/register"
              className=" text-gray-900 my-4 pl-5 font-semibold"
            >
              Đăng ký ngay <i className="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
