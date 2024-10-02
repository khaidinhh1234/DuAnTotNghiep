import axios from "axios";

const instanceClient = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL
  baseURL: "http://duantotnghiep.test/be/public/api/client/",
  headers: {
    "Content-Type": "application/json",
  },
});
export default instanceClient;
