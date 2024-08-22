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
      const { data } = await instance.post("/signin", user);
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
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg border border-slate-100 h-[480px]">
        <h1 className="text-2xl font-bold mb-4">Chào Mừng 👋</h1>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="robertfox@example.com"
              {...register("email", { required: true })}
            />
            {errors.email?.message && (
              <p className="text-red-600">{errors.email?.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="••••••••••••••••"
              {...register("password", { required: true })}
            />
            {errors.password?.message && (
              <p className="text-red-600">{errors.password?.message}</p>
            )}
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              className="mr-2"
            />
            <label htmlFor="remember-me" className="text-gray-700">
              Ghi Nhớ Đăng Nhập
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900"
          >
            Đăng Nhập
          </button>
          <a
            href="#"
            className="block text-right text-gray-600 mt-4 hover:underline"
          >
            Quên Mật Khẩu?
          </a>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
