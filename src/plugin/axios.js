import axios from "axios";
import { storageRequest } from "helpers/storageRequests";
import { apiRequest } from "helpers/apiRequests";
import { REACT_APP_REFRESH_TOKEN } from "constants/urls";

// define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://203.109.113.162:9098/CxPay-micro-services",
});

const API_URL = process.env.REACT_APP_API_URL;
const API_refreshToken = REACT_APP_REFRESH_TOKEN;

axiosInstance.interceptors.request.use((config) => {
  const token = storageRequest.getAuth();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // const accountNumber = getCookie("auth._account_number");
  // if (accountNumber) config.headers.accountnumber = accountNumber;
  return config;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  async (response) => {
    const originalRequest = response.config;
    const token = storageRequest.getAuth();
    if (!token) return response;
    const { exp } = JSON.parse(atob(token?.split(".")[1]));
    const expireTm = exp * 1000; // actual expire time
    const expireSlot = new Date(expireTm - 60000 * 5).getTime(); // reduce 1 min from the actual expire time
    const currentTm = new Date().getTime(); // time now
    console.log(
      new Date(currentTm).toLocaleTimeString(),
      new Date(expireSlot).toLocaleTimeString(),
      new Date(expireTm).toLocaleTimeString()
    );
    if (
      originalRequest.url !== `${API_URL}${API_refreshToken}` &&
      currentTm > expireSlot &&
      currentTm < expireTm
    ) {
      try {
        const { data } = await apiRequest.refreshToken({ token });
        if (!data.success) throw data.message;
        if (data.token) storageRequest.setAuth(data.token);
      } catch (error) {
        storageRequest.removeAuth();
        window.location = "/login";
        console.log(error);
      }
    }
    return response;
  },
  (error) => {
    const errResponse = error.response;
    if (errResponse && errResponse.status === 401 && errResponse.data) {
      storageRequest.removeAuth();
      window.location = "/login";
    } else return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       originalRequest.url !== loginUrl &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem("refresh_token");
//       if (refreshToken) {
//         try {
//           await refreshTokenApi();
//           // axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
//           return axiosInstance(originalRequest);
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );
