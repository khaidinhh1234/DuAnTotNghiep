import instance from "@/configs/axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/common/validations/auth";
import { time } from "@/assets/img";

type IUser = {
  password: string;
  password_confirmation: string;
  token: string;
};
const Error = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const token = queryParams.get("token");
  // // console.log(token);
  // const nav = useNavigate();
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<IUser>({
  //   resolver: zodResolver(changePassword),
  // });
  // const { mutate } = useMutation({
  //   mutationFn: async (user: IUser) => {
  //     try {
  //       const res = await instance.post("/reset-password", user);
  //       console.log(res);
  //       if (res.data.status) {
  //         toast.success(res.data.message);
  //         setTimeout(() => {
  //           nav(`/login`);
  //         }, 2000);
  //         return res.data;
  //       } else {
  //         toast.error("Đổi mật khẩu thất bại");

  //         return false;
  //       }
  //     } catch (error: any) {
  //       // toast.error(error.response.data.message);
  //       toast.error("Đổi mật khẩu thất bại");
  //     }
  //   },
  // });
  // const onSubmit = (data: IUser) => {
  //   mutate({ ...data, token } as any);
  // };

  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-2xl rounded-lg  hover:shadow-black">
        {" "}
        <img src={time} alt="" />
        <h2 className="text-2xl font-bold mb-2">
          Đã hết thời gian đổi mật khẩu
        </h2>
        <p className="text-gray-600 mb-6">
          Thời hạn sử dụng dịch chỉ trong{" "}
          <span className="text-red-500 font-bold">05</span> phút
        </p>
        <p className="text-gray-600 mb-6">
          Vui lòng thực hiện lại gửi lại yêu cầu quên mật khẩu bằng cách click{" "}
          <Link to="/forgotpassword" className="text-blue-500 underline">
            vào đây
          </Link>
        </p>
        <button className="bg-black hover:bg-black/60 text-white font-bold py-2 px-4 rounded">
          Quay về đăng nhập
        </button>
      </div>
    </section>
  );
};

export default Error;
