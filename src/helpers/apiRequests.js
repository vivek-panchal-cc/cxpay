import { axiosInstance } from "plugin/axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_login = process.env.REACT_APP_LOGIN;
const API_verifyMobileNumber = process.env.REACT_APP_VERIFY_MOBILE_NUMBER;
const API_verifyRegisterOtp = process.env.REACT_APP_VERIFY_REGISTER_OTP;
const API_getProfile = process.env.REACT_APP_GET_PROFILE;
const API_loginOtp = process.env.REACT_APP_LOGIN_OTP;
const API_verifyLoginOtp = process.env.REACT_APP_LOGIN_OTP_VERIFY;
const API_registerUser = process.env.REACT_APP_REGISTER_USER;

// POST @login API
// @params user_name, password
export const loginUser = (creds) => {
  return axiosInstance.post(`${API_URL}${API_login}`, creds);
};

// POST @register-mobile API
// @params mobile_number
export const verifyMobileNumber = (params) => {
  return axiosInstance.post(`${API_URL}${API_verifyMobileNumber}`, params);
};

// POST @verify-register-otp API
// @params mobile_number, user_otp
export const verifyRegisterOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_verifyRegisterOtp}`, params);
};

// GET @get-profile API
// @params auth_token
export const getUserProfile = () => {
  return axiosInstance.get(`${API_URL}${API_getProfile}`);
};

// POST @login-otp API
// @params mobile_number
export const loginOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_loginOtp}`, params);
};

// POST @verifyLoginOtp API
// @params mobile_number, user_otp
export const verifyLoginOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_verifyLoginOtp}`, params);
};

// POST @register-user API
// @params for BUSINESS company_name, user_type, email, password, mobile_number, profile_image
// @params for PERSONAL first_name, last_name, user_type, user_app_id, email, password, mobile_number, country, city, profile_image
export const registerUser = (params) => {
  return axiosInstance.post(`${API_URL}${API_registerUser}`, params);
};

export const apiRequest = {
  loginUser,
  loginOtp,
  getUserProfile,
  verifyMobileNumber,
  verifyRegisterOtp,
  verifyLoginOtp,
  registerUser,
};
