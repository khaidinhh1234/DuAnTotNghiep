import axios from "axios";
const user = JSON.parse(localStorage.getItem("user") || "{}");
const tokens = localStorage.getItem("access_token");
const token = tokens ?? user?.access_token;
console.log(token);
const instance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL

  baseURL:
    import.meta.env.VITE_BASE_URL ||
    "http://duantotnghiep.test/be/public/api/admin/",
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});
export default instance;
