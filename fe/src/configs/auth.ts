import axios from "axios";

const instanceauth = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL
  baseURL: "http://duantotnghiep.test/be/public/api/",
});

export default instanceauth;
