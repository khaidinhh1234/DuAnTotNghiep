import React from "react";
import { message } from "antd";
import { ReactElement } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Correct import for React Router DOM
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Include styles for toast

import instance from "./../configs/auth";

interface Props {
  children: ReactElement;
}
const PrivateShipper: React.FC<Props> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const access_token = JSON.parse(localStorage.getItem("access_token") || "{}");
  const token = user?.access_token;
  // console.log(token);
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${access_token}`;
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
  const isAuthenticated = !!user.access_token;

  // Xử lý điều hướng

  if (!isAuthenticated || !isDeliveryPerson) {
    message.error("Bạn không có quyền truy cập");
    return <Navigate to="/login" />;
  }

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

export default PrivateShipper;
