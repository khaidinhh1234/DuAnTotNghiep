import axios from "axios";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const token = user?.access_token;

const instanceClient = axios.create({
  baseURL:
    import.meta.env.VITE_BASE_URL ||
    "http://duantotnghiep.test/be/public/api/client/",

  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// instanceClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error?.response?.status === 401) {
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default instanceClient;
