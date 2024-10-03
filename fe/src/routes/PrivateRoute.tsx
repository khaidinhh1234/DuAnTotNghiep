import instance from "@/configs/auth";
import { type ReactElement } from "react";
import { Navigate } from "react-router";

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
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
  // Replace with your auth condition
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
