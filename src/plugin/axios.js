import axios from "axios";
import { loginUrl } from "constants/urls.js";
import { getCookie } from "shared/cookies";
import { refreshTokenApi } from "apiService/auth";

// define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://203.109.113.162:9098/CxPay-micro-services",
});

axiosInstance.interceptors.request.use((config) => {
  const token = getCookie("auth._token.Bearer");
  const BearerToken = token ? token : null;
  config.headers.Authorization = `Bearer ${BearerToken}`;
  config.headers.appid =
    process.env.APP_ID || "12e14140-73b5-4e4f-9949-ce5bb1769429";
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      originalRequest.url !== loginUrl &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          await refreshTokenApi();
          // axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (error) {
          console.error(error);
        }
      }
    }
    return Promise.reject(error);
  }
);
