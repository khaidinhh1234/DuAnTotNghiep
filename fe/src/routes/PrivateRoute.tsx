import { message } from "antd";
import React, { ReactElement } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Correct import for React Router DOM
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Include styles for toast

import instance from "./../configs/auth";

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.access_token;
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // Lọc vai trò không phải là "Khách hàng"
  const isDeliveryPerson = user?.user?.vai_tros?.some(
    (vai_tro: any) => vai_tro?.ten_vai_tro === "Người giao hàng"
  );

  // Kiểm tra vai trò không phải là "Khách hàng"
  const hasPermission = user?.user?.vai_tros?.some(
    (vai_tro: any) => vai_tro?.ten_vai_tro !== "Khách hàng"
  );

  // Kiểm tra trạng thái xác thực
  const isAuthenticated = !!user.access_token && hasPermission;

  // Xử lý điều hướng
  const nav = useNavigate();

  if (!isAuthenticated) {
    message.error("Bạn không có quyền truy cập");
    return <Navigate to="/login" />;
  }

  if (isDeliveryPerson) {
    nav("/shipp");
  }
  // if (isAuthenticated) {
  //   toast.success("Đăng nhập thành công");
  //   return <HomePage></HomePage>;
  // }
  // const userAPI = axios.create({
  //   baseURL: "http://duantotnghiep.test/be/public/api",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // Thử gọi API
  // userAPI
  //   .get("/admin/sanpham")
  //   .then((response) => console.log(response.data))
  //   .catch((error) => console.error("Error:", error));
  // if (isAuthenticated) {
  //   toast.success("Đăng nhập thành công");
  //   return <Navigate to="/" />;
  // }

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
