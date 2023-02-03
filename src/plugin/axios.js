import axios from 'axios';

 const getCookie = n => {
    const a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);  
    return a ? a[1] : '';
  };

  // define API_URL and APP ID in env file
export const axiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://203.109.113.162:9098'
});

axiosInstance.interceptors.request.use(
  config => {
    const token = getCookie('auth._token.Bearer');
    const BearerToken = token ? token : null;
    config.headers.Authorization = `Bearer ${BearerToken}`;
    config.headers.appid = process.env.APP_ID || '12e14140-73b5-4e4f-9949-ce5bb1769429';

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);