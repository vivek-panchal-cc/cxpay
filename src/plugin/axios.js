import axios from "axios";
import { loginUrl, refreshTokenUrl } from "constants/urls.js";
import { getCookie } from "shared/cookies";
import { refreshTokenApi } from "apiService/auth";

// define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL: process.env.API_URL || "http://203.109.113.162:9098",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("auth._token.Bearer");
    const BearerToken = token ? token : null;
    config.headers.Authorization = `Bearer ${BearerToken}`;
    config.headers.appid =
      process.env.APP_ID || "12e14140-73b5-4e4f-9949-ce5bb1769429";
    return config;
  },
  async (err) => {
    console.log("axios err", err);
    const originalConfig = err.config;
    if (originalConfig.url !== loginUrl && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          await refreshTokenApi();
          return axiosInstance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
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