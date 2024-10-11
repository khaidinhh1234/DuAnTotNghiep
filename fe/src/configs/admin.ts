import axios from "axios";
const user = JSON.parse(localStorage.getItem("user") || "{}");
const token = user?.access_token;
const instance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL

  baseURL: "http://duantotnghiep.test/be/public/api/admin/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
export default instance;
