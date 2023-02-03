import { axiosInstance } from "plugin/axios.js";
import { loginUrl } from "constants/urls.js";

var now = new Date();
var time = now.getTime();
// token will expire after 2 hrs
time += 1 * 60 * 60 * 1000;
now.setTime(time);

export const loginApi = async (payload) => {
  try {
    let response = await axiosInstance.post(loginUrl, payload);
    if (response.data?.data?.token) {
      // document.cookie = `auth._token.Bearer=${response.data.data.token}`;
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
    };
    return response;
  }
};
