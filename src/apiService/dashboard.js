import { axiosInstance } from "plugin/axios.js";
import { userProfileUrl } from "constants/urls.js";

export const userProfileApi = async () => {
  try {
    let response = axiosInstance.get(userProfileUrl);
    return response;
  } catch (err) {
    let response = {
      status: false,
      msg: "something went wrong",
    };
    return response;
  }
};
