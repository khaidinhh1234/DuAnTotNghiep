import axios from "axios";

const instance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL
  baseURL: "http://duantotnghiep.test/be/public/api/admin/",
  headers: {
    "Content-Type": "application/json",
  },
});
export default instance;
