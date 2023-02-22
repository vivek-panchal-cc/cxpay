import { axiosInstance } from "plugin/axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_login = process.env.REACT_APP_LOGIN;
const API_logout = process.env.REACT_APP_LOGOUT;
const API_verifyMobileNumber = process.env.REACT_APP_VERIFY_MOBILE_NUMBER;
const API_verifyRegisterOtp = process.env.REACT_APP_VERIFY_REGISTER_OTP;
const API_getProfile = process.env.REACT_APP_GET_PROFILE;
const API_loginOtp = process.env.REACT_APP_LOGIN_OTP;
const API_verifyLoginOtp = process.env.REACT_APP_LOGIN_OTP_VERIFY;
const API_registerUser = process.env.REACT_APP_REGISTER_USER;
const API_updateUser = process.env.REACT_APP_UPDATE_USER;
const API_passwordChange = process.env.REACT_APP_PASSWORD_CHANGE;
const API_generateForgotPasswordOtp =
  process.env.REACT_APP_GENERATE_FORGOT_PASSWORD_OTP;
const API_verifyForgotPasswordOtp =
  process.env.REACT_APP_VERIFY_FORGOT_PASSWORD_OTP;
const API_updateForgotPassword =
  process.env.REACT_APP_UPDATE_FORGOT_PASSWORD_OTP;
const API_linkBank = process.env.REACT_APP_ADD_BANK;
const API_addCard = process.env.REACT_APP_ADD_CARD;
const API_addContact = process.env.REACT_APP_ADD_CONTACT;
const API_getConatcts = process.env.REACT_APP_GET_CONTACT_LIST;
const API_deleteContact = process.env.REACT_APP_DELETE_CONTACT;

// POST @login API
// @params user_name, password
export const login = (creds) => {
  return axiosInstance.post(`${API_URL}${API_login}`, creds);
};

// POST @logout API
// @params auth_token
export const logout = () => {
  return axiosInstance.post(`${API_URL}${API_logout}`);
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
  return axiosInstance.post(`${API_URL}${API_getProfile}`);
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

// POST @update-user API
// @params account_number , user_type , company_name,first_name,last_name,city,country,profile_image
export const updateUser = (params) => {
  return axiosInstance.post(`${API_URL}${API_updateUser}`, params);
};
// POST @password-change API
// @params current_password, new_password, confirm_password
export const passwordChange = (params) => {
  return axiosInstance.post(`${API_URL}${API_passwordChange}`, params);
};

// POST @generate-forgot-password-otp-change API
// @params mobile_number
export const generateForgotPasswordOtpChange = (params) => {
  return axiosInstance.post(
    `${API_URL}${API_generateForgotPasswordOtp}`,
    params
  );
};

// POST @verify-forgot-password-otp API
// @params mobile_number , user_otp
export const verifyForgotPasswordOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_verifyForgotPasswordOtp}`, params);
};

// POST @update-forgot-password API
// @params password
export const updateForgotPassword = (params) => {
  return axiosInstance.post(`${API_URL}${API_updateForgotPassword}`, params);
};

// POST @add-bank API
// @params bank_number,account_number,routing_number,account_type
export const linkBank = (params) => {
  return axiosInstance.post(`${API_URL}${API_linkBank}`, params);
};

// POST @add-bank API
// @params bank_number,account_number,routing_number,account_type
export const addCard = (params) => {
  return axiosInstance.post(`${API_URL}${API_addCard}`, params);
};

// POST @add-contact API
// @params mobile,email
export const addContact = (params) => {
  return axiosInstance.post(`${API_URL}${API_addContact}`, params);
};

// POST @contacts-list API
// @params auth_token
export const getConatcts = (params) => {
  return axiosInstance.post(`${API_URL}${API_getConatcts}`, params);
};

// POST @delete-contact API
// @params mobile array
export const deleteContact = (params) => {
  return axiosInstance.post(`${API_URL}${API_deleteContact}`, params);
};

export const apiRequest = {
  login,
  logout,
  loginOtp,
  getUserProfile,
  verifyMobileNumber,
  verifyRegisterOtp,
  verifyLoginOtp,
  registerUser,
  updateUser,
  passwordChange,
  generateForgotPasswordOtpChange,
  verifyForgotPasswordOtp,
  updateForgotPassword,
  linkBank,
  addCard,
  addContact,
  getConatcts,
  deleteContact,
};
