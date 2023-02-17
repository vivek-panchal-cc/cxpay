import axios from "axios";
import { loginUrl } from "constants/urls.js";
import { getCookie } from "shared/cookies";
import { refreshTokenApi } from "apiService/auth";
import { storageRequest } from "helpers/storageRequests";

// define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://203.109.113.162:9098/CxPay-micro-services",
});

axiosInstance.interceptors.request.use((config) => {
  const token = storageRequest.getAuth();
  if (token !== undefined) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // const accountNumber = getCookie("auth._account_number");
  // if (accountNumber) config.headers.accountnumber = accountNumber;
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
