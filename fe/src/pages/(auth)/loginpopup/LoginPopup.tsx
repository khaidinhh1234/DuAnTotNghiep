import { IUser } from '@/common/types/user';
import { loginSchema, registerSchema } from '@/common/validations/auth';
import instance from '@/configs/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Form đăng ký (đơn giản cho ví dụ này)
const RegisterForm = ({ setIsRegistering }: any) => {
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
        const res = await instance.post("/register", user);
        
        // Log the response to check for success
        console.log(res);
        
        if (res.data && res.data.success) { // Assuming `res.data.success` indicates success
          toast.success("Đăng ký thành công");
          nav("/login"); // Navigate to login page
        } else {
          toast.error("Đăng ký thất bại");
        }
        
        return res.data;
      } catch (error: any) {
        console.log(error.response);  // Log error details
        if (error.response?.data === "Tài khoản đã tồn tại ") {
          toast.error("Tài khoản đã tồn tại");
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
    <div className="w-full max-w-md p-6 md:p-8 ">
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
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className="text-gray-900 font-semibold"
          >
            Đăng nhập ngay
          </button>
        </div>
      </form>
    </div>
  </section>
  );
};

// Form đăng nhập
const LoginPopup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Quản lý trạng thái form đăng ký
  const nav = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate } = useMutation({
    mutationFn: async (user: IUser) => {
      // console.log(user);
      const { data } = await instance.post("/login", user);

      localStorage.setItem("user", JSON.stringify(data));
      // console.log(data);
      localStorage.setItem("accessToken", data?.access_token);
      
      toast.success(" Glow Clothing Xin chào bạn");
      return nav("/");
    },
    onSuccess: () => {
    },
    onError: (error: any) => {
      if (
        error.response.data.message ==
        "Tài khoản hoặc mật khẩu không chính xác."
      ) {
        toast.error("Tài khoản hoặc mật khâu không chính xác");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 h-auto">
        <h1 className="text-2xl font-bold mb-4 ">Chào Mừng 👋</h1>
        <p className="text-gray-600 mb-6 text-xs  my-5">
          Thành viên Glow Clothing <br />
          <span>để nhận nhiều những chương trình ưu đãi hấp dẫn,</span>
        </p>
        {isRegistering ? (
          <RegisterForm setIsRegistering={setIsRegistering} />
        ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="glowclothing24@example.com"
              {...register("email", { required: true })}
            />
            {errors.email?.message && (
              <p className="text-red-600 mt-1">{errors.email?.message}</p>
            )}
          </div>

          <div className="mb-2 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>{" "}
            <div
              className="absolute right-5 top-11 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye  "></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </div>
            <input
              type={`${showPassword ? "text" : "password"}`}
              className={`w-full p-3 border  rounded-md   ${errors.email?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
              placeholder="••••••••••••••"
              {...register("password", { required: true })}
            />
            {errors.password?.message && (
              <p className="text-red-600 mt-1">{errors.password?.message}</p>
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
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-gray-900 my-4 pl-5 font-semibold"
              >
                Đăng ký ngay <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
        </form>
        )}
      </div>
    </section>
  );
};

export default LoginPopup;
