import instance from "@/configs/auth";
import { message } from "antd";
import { type ReactElement } from "react";
import { Navigate } from "react-router";
import { toast, ToastContainer } from "react-toastify"; // Chỉ sử dụng một trong hai thư viện

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // toast.error("Bạn không có quyền truy cập");
  instance.interceptors.request.use(
    (config) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Lọc vai trò không phải là "Khách hàng"
  const phanquyen = user?.user?.vai_tros?.filter(
    (vai_tro: any) => vai_tro?.ten_vai_tro !== "Khách hàng"
  );

  // Kiểm tra trạng thái xác thực
  const isAuthenticated = !!localStorage.getItem("user");
  // toast.error("Bạn không có quyền truy cập");
  if (!isAuthenticated || !phanquyen || phanquyen.length === 0) {
    // Sử dụng toast để hiển thị thông báo
    message.error("Bạn không có quyền truy cập");
    // toast.error("Bạn không có quyền truy cập"); // Hiển thị toast thông báo
    return <Navigate to="/adfsgvhb" />; // Chuyển hướng đến trang khác
  }

  // Trả về children nếu đã xác thực và có quyền
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default PrivateRoute;
