import { axiosInstance } from "plugin/axios.js";
import { loginUrl, refreshTokenUrl } from "constants/urls.js";
import { deleteCookie } from "shared/cookies";

var now = new Date();
var time = now.getTime();
// token will expire after 1 hrs
time += 1 * 60 * 60 * 1000;
now.setTime(time);

export const loginApi = async (payload) => {
  try {
    let response = await axiosInstance.post(loginUrl, payload);
    if (response.data?.data?.token) {
      document.cookie =
        "auth._token.Bearer=" +
        response.data?.data?.token +
        "; expires=" +
        now.toGMTString() +
        "; path=/";
      localStorage.setItem(
        "account_number",
        response.data?.data?.account_number
      );
    }
    return response;
  } catch (err) {
    let response = {
      status: false,
      msg: "something went wrong",
      err: err,
    };
    return response;
  }
};

export const refreshTokenApi = async () => {
  try {
    // ensure deletion of cookie in case refresh token api failed
    deleteCookie();
    // import your accessToken here
    let accessToken = "";
    let response = await axiosInstance.post(refreshTokenUrl, accessToken);
    if (response.data?.data?.token) {
      document.cookie =
        "auth._token.Bearer=" +
        response.data?.data?.token +
        "; expires=" +
        now.toGMTString() +
        "; path=/";
    }
    return response;
  } catch (err) {
    let response = {
      status: false,
      msg: "something went wrong",
      err: err,
    };
    return response;
  }
};
