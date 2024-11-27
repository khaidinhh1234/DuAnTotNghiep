import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/common/validations/auth";
import { Skeleton } from "antd";
import instance from "@/configs/auth";
type IUser = {
  password: string;
  password_confirmation: string;
  token: string;
};
const Change = () => {
  // const nav = useNavigate(); // Removed duplicate declaration
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { data, isLoading } = useQuery({
    queryKey: ["check"],
    queryFn: async () => {
      try {
        const res = await instance.post("/check-token-forgot", { token });

        return res.data;
      } catch (error: any) {
        toast.error(error.response.data.message);

        nav(`/Error`);

        throw error;
      }
    },
  });
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(changePassword),
  });
  const { mutate } = useMutation({
    mutationFn: async (user: IUser) => {
      try {
        const res = await instance.post("/reset-password", user);
        if (res.data.status) {
          toast.success(res.data.message);
          setTimeout(() => {
            nav(`/login`);
          }, 2000);
          return res.data;
        } else {
          toast.error("Đổi mật khẩu thất bại");

          return false;
        }
      } catch (error: any) {
        // toast.error(error.response.data.message);
        toast.error("Đổi mật khẩu thất bại");
      }
    },
  });
  const onSubmit = (data: IUser) => {
    mutate({ ...data, token } as any);
  };

  // const recaptchaRef = React.createRef<ReCAPTCHA>();
  // const handleInputChange = (e: any) => {
  //   e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
  // };

  // const onSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const recaptchaValue = recaptchaRef.current?.getValue();
  //   if (!recaptchaValue) {
  //     alert("Vui lòng xác minh bạn không phải robot");
  //     return;
  //   }

  // Gọi API tới backend tại http://localhost:8080/api/v1/vea
  // setLoading(true);

  // if (response.data.success) {
  //   alert("Xác thực reCAPTCHA thành công!");
  // } else {
  //   alert("Xác thực reCAPTCHA thất bại!");
  // }
  isLoading && (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      Đang xác thực...
    </div>
  );

  const trues = data?.status;

  return (
    <>
      {trues == true ? (
        <section className="flex-1 flex items-center justify-center p-4 md:p-0">
          <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
            <div className="mb-6">
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

            <h2 className="text-3xl font-bold mb-2">Đặt lại mật khẩu</h2>
            <p className="text-gray-600 mb-6">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full p-3 border  rounded-md   ${errors.password?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
                  placeholder="••••••••••••••••"
                />
                {errors.password && (
                  <p className="text-red-600 my-1">{errors.password.message}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  {...register("password_confirmation", { required: true })}
                  className={`w-full p-3 border  rounded-md   ${errors.password_confirmation?.message ? "border-red-600 placeholder-red-400" : "border-gray-300"}`}
                  placeholder="••••••••••••••••"
                />
                {errors.password_confirmation && (
                  <p className="text-red-600 my-1">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>
              {/* <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LeZ7DsqAAAAAFQ4zz5W8jQ9DzNxF6MDRLr4QWBB"
          /> */}
              <button
                type="submit"
                className=" mt-4 w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold"
              >
                Xác Nhận
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="flex-1 flex items-center justify-center p-4 md:p-0">
          <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-2xl rounded-lg  hover:shadow-black">
            <img src={""} alt="" />
            <h2 className="text-2xl font-bold mb-2">
              <Skeleton />
            </h2>
            <p className="text-gray-600 mb-6">
              <Skeleton />
              <span className="text-red-500 font-bold">
                <Skeleton />
              </span>
            </p>
            <p className="text-gray-600 mb-6">
              <Skeleton />
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default Change;
