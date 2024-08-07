import axios from "axios";
import { storageRequest } from "helpers/storageRequests";
import { API_LOGIN_REFRESH_TOKEN } from "constants/urls";
import { toast } from "react-toastify";
import { browserName, fullVersion, timeZone } from "../helpers/headerRequests";

// define API_URL in env file
const axiosLoginInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_CUSTOMER_LOGIN || "http://3.13.181.86:8081",
});
const axiosOnboardInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_CUSTOMER_ONBOARD || "http://3.13.181.86:8082",
});
const axiosTransactionInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_CUSTOMER_TRANSACTION || "http://3.13.181.86:8083",
});
const axiosAdminInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_CUSTOMER_ADMIN || "http://3.13.181.86:8084",
});

// Define inteceptors
const requestInterceptor = (config) => {
  const countryTimeZone = storageRequest.getTimeZone();
  const country_time_zone = countryTimeZone
    ? countryTimeZone.country_time_zone
    : null;
  const token = storageRequest.getAuth();
  config.headers["Os-Version"] = `${browserName}/${fullVersion}`;
  config.headers["Device-Type"] = "web";
  config.headers["User-Timezone"] = country_time_zone || timeZone;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const responseInterceptor = async (response) => {
  const originalRequest = response.config;
  const token = storageRequest.getAuth();
  if (!token) return response;
  const { exp } = JSON.parse(atob(token?.split(".")[1]));
  const expireTm = exp * 1000; // actual expire time
  const expireSlot = new Date(expireTm - 60000 * 5).getTime(); // reduce 5 min from the actual expire time
  const currentTm = new Date().getTime(); // time now
  return response;
};

let isToastShown = false;

const responseErrorInterceptor = (error) => {
  const errResponse = error.response;
  if (
    errResponse &&
    (errResponse.status === 401 ||
      errResponse.status === 451 ||
      errResponse.status === 422) &&
    errResponse.data
  ) {
    const token = storageRequest.getAuth();
    if (token) {
      toast.success(errResponse.data.message);
    }
    storageRequest.removeAuth();
    window.location.href = "/login";
    return Promise.reject(error);
  } else if (
    (errResponse.status === 423 || errResponse.status === 424) &&
    !isToastShown
  ) {
    const { redirect_to, system_option_manual_kyc_status } =
      errResponse.data?.data;
    if (redirect_to === "423B" || redirect_to === "424B") {
      window.location.href = `/kyc-manual-second-step?message=${encodeURIComponent(
        errResponse.data.message
      )}`;
    } else if (redirect_to === "423A" || redirect_to === "424A") {
      const token = storageRequest.getAuth();
      if (token) {
        toast.success(errResponse.data.message);
        isToastShown = true;
      }
      setTimeout(() => {
        window.location.href = `/complete-kyc-initial?message=${encodeURIComponent(
          errResponse.data.message
        )}`;
      }, 3000);
    } else if (redirect_to === "424C") {
      window.location.href = `/send-mail?message=${encodeURIComponent(
        errResponse.data.message
      )}&system_option_manual_kyc_status=${encodeURIComponent(
        system_option_manual_kyc_status
      )}&is_renew=${encodeURIComponent(false)}`;
    }
  } else if (errResponse.status === 428) {
    window.location.href = `/complete-kyc-initial?message=${encodeURIComponent(
      errResponse.data.message
    )}`;
  }
  return Promise.reject(error);
};

// Binding interceptors to axios instances
axiosLoginInstance.interceptors.request.use(requestInterceptor);
axiosLoginInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);
axiosOnboardInstance.interceptors.request.use(requestInterceptor);
axiosOnboardInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

axiosTransactionInstance.interceptors.request.use(requestInterceptor);
axiosTransactionInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

axiosAdminInstance.interceptors.request.use(requestInterceptor);
axiosAdminInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export {
  axiosLoginInstance,
  axiosOnboardInstance,
  axiosTransactionInstance,
  axiosAdminInstance,
};
