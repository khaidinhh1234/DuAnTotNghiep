import React from "react";
import { message } from "antd";
import axios from "axios";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom"; // Correct import for React Router DOM
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Include styles for toast
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.access_token;

  // Lọc vai trò không phải là "Khách hàng"
  const phanquyen = user?.user?.vai_tros?.filter(
    (vai_tro: any) => vai_tro?.ten_vai_tro !== "Khách hàng"
  );

  // Kiểm tra trạng thái xác thực
  const isAuthenticated = !!token && phanquyen && phanquyen.length > 0;

  // Nếu chưa xác thực hoặc không có quyền, chuyển hướng về trang đăng nhập
  if (!isAuthenticated) {
    message.error("Bạn không có quyền truy cập");
    return <Navigate to="/login" />;
  }

  const userAPI = axios.create({
    baseURL: "http://duantotnghiep.test/be/public/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Sử dụng interceptor để gán token vào headers
  userAPI.interceptors.request.use(
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

  // Sử dụng useQuery để lấy dữ liệu sản phẩm
  const { data } = useQuery({
    queryKey: ["sanpham"],
    queryFn: async () => {
      const { data } = await userAPI.get("/admin/sanpham"); // Sử dụng userAPI
      return data;
    },
  });

  // Kiểm tra dữ liệu
  console.log(data);

  // Nếu đã xác thực và có quyền, trả về children
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
