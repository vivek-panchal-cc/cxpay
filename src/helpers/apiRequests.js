import * as apiUrl from "constants/urls";
import { axiosInstance } from "plugin/axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_login = apiUrl.REACT_APP_LOGIN;
const API_logout = apiUrl.REACT_APP_LOGOUT;
const API_verifyMobileNumber = apiUrl.REACT_APP_VERIFY_MOBILE_NUMBER;
const API_verifyRegisterOtp = apiUrl.REACT_APP_VERIFY_REGISTER_OTP;
const API_getProfile = apiUrl.REACT_APP_GET_PROFILE;
const API_loginOtp = apiUrl.REACT_APP_LOGIN_OTP;
const API_verifyLoginOtp = apiUrl.REACT_APP_LOGIN_OTP_VERIFY;
const API_registerUser = apiUrl.REACT_APP_REGISTER_USER;
const API_updateUser = apiUrl.REACT_APP_UPDATE_USER;
const API_passwordChange = apiUrl.REACT_APP_PASSWORD_CHANGE;
const API_generateForgotPasswordOtp =
  apiUrl.REACT_APP_GENERATE_FORGOT_PASSWORD_OTP;
const API_verifyForgotPasswordOtp = apiUrl.REACT_APP_VERIFY_FORGOT_PASSWORD_OTP;
const API_updateForgotPassword = apiUrl.REACT_APP_UPDATE_FORGOT_PASSWORD_OTP;
const API_linkBank = apiUrl.REACT_APP_ADD_BANK;
const API_addCard = apiUrl.REACT_APP_ADD_CARD;
const API_deleteCard = apiUrl.REACT_APP_DELETE_CARD;
const API_getCountry = apiUrl.REACT_APP_GET_COUNTRY;
const API_refreshToken = apiUrl.REACT_APP_REFRESH_TOKEN;
const API_resendLoginOtp = apiUrl.REACT_APP_RESEND_LOGIN_OTP;
const API_resendForgotPasswordOtp = apiUrl.REACT_APP_RESEND_FORGOT_PASSWORD_OTP;
const API_resendRegisterOtp = apiUrl.REACT_APP_RESEND_REGISTER_OTP;
const API_updateBusinessUrl = apiUrl.REACT_APP_UPDATE_BUSINESS_URL;
const API_generateNewQrCode = apiUrl.REACT_APP_GENERATE_QR_CODE;
const API_cardsList = apiUrl.REACT_APP_CARDS_LIST;
const API_bankList = apiUrl.REACT_APP_BANK_LIST;
const API_deleteBank = apiUrl.REACT_APP_DELETE_BANK;
const API_getCardColor = apiUrl.REACT_APP_GET_CARD_COLOR;

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
// @params mobile_number, country_code
export const verifyMobileNumber = (params) => {
  return axiosInstance.post(`${API_URL}${API_verifyMobileNumber}`, params);
};

// POST @verify-register-otp API
// @params mobile_number, user_otp
export const verifyRegisterOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_verifyRegisterOtp}`, params);
};

// POST @get-profile API
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

// POST @add-bank API
// @params id(card id)
export const deleteCard = (params) => {
  return axiosInstance.post(`${API_URL}${API_deleteCard}`, params);
};

// POST @get-country API
// @params
export const getCountry = () => {
  return axiosInstance.post(`${API_URL}${API_getCountry}`);
};

// POST @get-country API
// @params authToken
export const refreshToken = (token) => {
  return axiosInstance.post(`${API_URL}${API_refreshToken}`, token);
};

// POST @login-otp-resend API
// @params mobile_number
export const resendLoginOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_resendLoginOtp}`, params);
};

// POST @resend-forgot-password-otp API
// @params mobile_number
export const resendForgotPasswordOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_resendForgotPasswordOtp}`, params);
};

// POST @resend-register-otp API
// @params mobile_number
export const resendRegisterOtp = (params) => {
  return axiosInstance.post(`${API_URL}${API_resendRegisterOtp}`, params);
};

// POST @cards-list API
// @params
export const cardsList = () => {
  return axiosInstance.post(`${API_URL}${API_cardsList}`);
};

// POST @update-business-url API
// @params business_url
export const updateBusinessUrl = (params) => {
  return axiosInstance.post(`${API_URL}${API_updateBusinessUrl}`, params);
};

// POST @generate-new-qrcode API
// @params
export const generateNewQrCode = () => {
  return axiosInstance.post(`${API_URL}${API_generateNewQrCode}`);
};

// POST @banks-list API
// @params
export const getBankList = () => {
  return axiosInstance.post(`${API_URL}${API_bankList}`);
};

// POST @delete-bank
// @params id
export const deleteBank = (params) => {
  return axiosInstance.post(`${API_URL}${API_deleteBank}`, params);
};

// GET @get-card-color
// @params
export const getCardColor = () => {
  return axiosInstance.get(`${API_URL}${API_getCardColor}`);
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
  deleteCard,
  getCountry,
  refreshToken,
  resendLoginOtp,
  resendForgotPasswordOtp,
  resendRegisterOtp,
  cardsList,
  updateBusinessUrl,
  generateNewQrCode,
  getBankList,
  deleteBank,
  getCardColor,
};
