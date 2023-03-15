import * as apiUrl from "constants/urls";
import { axiosLoginInstance, axiosOnboardInstance } from "plugin/axios";

// LOGIN SERVICES
const API_login = apiUrl.API_LOGIN_LOGIN;
const API_logout = apiUrl.API_LOGIN_LOGOUT;
const API_loginOtp = apiUrl.API_LOGIN_LOGIN_OTP;
const API_verifyLoginOtp = apiUrl.API_LOGIN_LOGIN_OTP_VERIFY;
const API_passwordChange = apiUrl.API_LOGIN_PASSWORD_CHANGE;
const API_generateForgotPasswordOtp =
  apiUrl.API_LOGIN_GENERATE_FORGOT_PASSWORD_OTP;
const API_verifyForgotPasswordOtp = apiUrl.API_LOGIN_VERIFY_FORGOT_PASSWORD_OTP;
const API_updateForgotPassword = apiUrl.API_LOGIN_UPDATE_FORGOT_PASSWORD_OTP;
const API_resendLoginOtp = apiUrl.API_LOGIN_RESEND_LOGIN_OTP;
const API_resendForgotPasswordOtp = apiUrl.API_LOGIN_RESEND_FORGOT_PASSWORD_OTP;
const API_refreshToken = apiUrl.API_LOGIN_REFRESH_TOKEN;

// ONBOARD SERVICES
const API_verifyMobileNumber = apiUrl.API_ONBOARD_VERIFY_MOBILE_NUMBER;
const API_verifyRegisterOtp = apiUrl.API_ONBOARD_VERIFY_REGISTER_OTP;
const API_getProfile = apiUrl.API_ONBOARD_GET_PROFILE;
const API_registerUser = apiUrl.API_ONBOARD_REGISTER_USER;
const API_updateUser = apiUrl.API_ONBOARD_UPDATE_USER;
const API_linkBank = apiUrl.API_ONBOARD_ADD_BANK;
const API_addCard = apiUrl.API_ONBOARD_ADD_CARD;
const API_deleteCard = apiUrl.API_ONBOARD_DELETE_CARD;
const API_getCountry = apiUrl.API_ONBOARD_GET_COUNTRY;
const API_resendRegisterOtp = apiUrl.API_ONBOARD_RESEND_REGISTER_OTP;
const API_updateBusinessUrl = apiUrl.API_ONBOARD_UPDATE_BUSINESS_URL;
const API_generateNewQrCode = apiUrl.API_ONBOARD_GENERATE_QR_CODE;
const API_cardsList = apiUrl.API_ONBOARD_CARDS_LIST;
const API_bankList = apiUrl.API_ONBOARD_BANK_LIST;
const API_deleteBank = apiUrl.API_ONBOARD_DELETE_BANK;
const API_getCardColor = apiUrl.API_ONBOARD_GET_CARD_COLOR;

const API_updateBusinessData = apiUrl.API_ONBOARD_UPDATE_BUSINESS_DATA;
const API_addContact = apiUrl.API_ONBOARD_ADD_CONTACT;
const API_getConatcts = apiUrl.API_ONBOARD_GET_CONTACT_LIST;
const API_deleteContact = apiUrl.API_ONBOARD_DELETE_CONTACT;
const API_favContact = apiUrl.API_ONBOARD_FAV_CONTACT;

const API_getCustomerNotification =
  apiUrl.API_ONBOARD_GET_CUSTOMER_NOTIFICATION;
const API_updateCustomerNotification =
  apiUrl.API_ONBOARD_UPDATE_CUSTOMER_NOTIFICATION;

//  -------------------------------------------- LOGIN ------------------------------------------------------------------------------------------>
//  ------------------------------------------------------------------------------------------------------------------------------------------------>

// POST @login API
// @params user_name, password
export const login = (creds) => {
  return axiosLoginInstance.post(`${API_login}`, creds);
};

// POST @logout API
// @params auth_token
export const logout = () => {
  return axiosLoginInstance.post(`${API_logout}`);
};

// POST @login-otp API
// @params mobile_number
export const loginOtp = (params) => {
  return axiosLoginInstance.post(`${API_loginOtp}`, params);
};

// POST @verifyLoginOtp API
// @params mobile_number, user_otp
export const verifyLoginOtp = (params) => {
  return axiosLoginInstance.post(`${API_verifyLoginOtp}`, params);
};

// POST @password-change API
// @params current_password, new_password, confirm_password
export const passwordChange = (params) => {
  return axiosLoginInstance.post(`${API_passwordChange}`, params);
};

// POST @generate-forgot-password-otp-change API
// @params mobile_number
export const generateForgotPasswordOtpChange = (params) => {
  return axiosLoginInstance.post(`${API_generateForgotPasswordOtp}`, params);
};

// POST @verify-forgot-password-otp API
// @params mobile_number , user_otp
export const verifyForgotPasswordOtp = (params) => {
  return axiosLoginInstance.post(`${API_verifyForgotPasswordOtp}`, params);
};

// POST @update-forgot-password API
// @params password
export const updateForgotPassword = (params) => {
  return axiosLoginInstance.post(`${API_updateForgotPassword}`, params);
};

// POST @login-otp-resend API
// @params mobile_number
export const resendLoginOtp = (params) => {
  return axiosLoginInstance.post(`${API_resendLoginOtp}`, params);
};

// POST @resend-forgot-password-otp API
// @params mobile_number
export const resendForgotPasswordOtp = (params) => {
  return axiosLoginInstance.post(`${API_resendForgotPasswordOtp}`, params);
};

// POST @get-country API
// @params authToken
export const refreshToken = (token) => {
  return axiosLoginInstance.post(`${API_refreshToken}`, token);
};

//  -------------------------------------------- ON BOARD ------------------------------------------------------------------------------------------>
//  ------------------------------------------------------------------------------------------------------------------------------------------------>

// POST @register-mobile API
// @params mobile_number, country_code
export const verifyMobileNumber = (params) => {
  return axiosOnboardInstance.post(`${API_verifyMobileNumber}`, params);
};

// POST @verify-register-otp API
// @params mobile_number, user_otp
export const verifyRegisterOtp = (params) => {
  return axiosOnboardInstance.post(`${API_verifyRegisterOtp}`, params);
};

// POST @get-profile API
// @params auth_token
export const getUserProfile = () => {
  return axiosOnboardInstance.post(`${API_getProfile}`);
};

// POST @register-user API
// @params for BUSINESS company_name, user_type, email, password, mobile_number, profile_image
// @params for PERSONAL first_name, last_name, user_type, user_app_id, email, password, mobile_number, country, city, profile_image
export const registerUser = (params) => {
  return axiosOnboardInstance.post(`${API_registerUser}`, params);
};

// POST @update-user API
// @params account_number , user_type , company_name,first_name,last_name,city,country,profile_image
export const updateUser = (params) => {
  return axiosOnboardInstance.post(`${API_updateUser}`, params);
};

// POST @add-bank API
// @params bank_number,account_number,routing_number,account_type
export const linkBank = (params) => {
  return axiosOnboardInstance.post(`${API_linkBank}`, params);
};

// POST @add-bank API
// @params bank_number,account_number,routing_number,account_type
export const addCard = (params) => {
  return axiosOnboardInstance.post(`${API_addCard}`, params);
};

// POST @add-bank API
// @params id(card id)
export const deleteCard = (params) => {
  return axiosOnboardInstance.post(`${API_deleteCard}`, params);
};

// POST @get-country API
// @params
export const getCountry = () => {
  return axiosOnboardInstance.post(`${API_getCountry}`);
};

// POST @resend-register-otp API
// @params mobile_number
export const resendRegisterOtp = (params) => {
  return axiosOnboardInstance.post(`${API_resendRegisterOtp}`, params);
};
// POST @add-contact API
// @params mobile,email
export const addContact = (params) => {
  return axiosOnboardInstance.post(`${API_addContact}`, params);
};

// POST @contacts-list API
// @params auth_token
export const getConatcts = (params) => {
  return axiosOnboardInstance.post(`${API_getConatcts}`, params);
};

// POST @delete-contact API
// @params mobile array
export const deleteContact = (params) => {
  return axiosOnboardInstance.post(`${API_deleteContact}`, params);
};

// POST @mark-as-favourite API
// @params mobile
export const favContact = (params) => {
  return axiosOnboardInstance.post(`${API_favContact}`, params);
};

// POST @cards-list API
// @params
export const cardsList = () => {
  return axiosOnboardInstance.post(`${API_cardsList}`);
};

// POST @update-business-url API
// @params business_url
export const updateBusinessUrl = (params) => {
  return axiosOnboardInstance.post(`${API_updateBusinessUrl}`, params);
};

// POST @generate-new-qrcode API
// @params
export const generateNewQrCode = () => {
  return axiosOnboardInstance.post(`${API_generateNewQrCode}`);
};

// POST @banks-list API
// @params
export const getBankList = () => {
  return axiosOnboardInstance.post(`${API_bankList}`);
};

// POST @delete-bank
// @params id
export const deleteBank = (params) => {
  return axiosOnboardInstance.post(`${API_deleteBank}`, params);
};

// GET @get-card-color
// @params
export const getCardColor = () => {
  return axiosOnboardInstance.get(`${API_getCardColor}`);
};

// POST @update-customer-business-data API
// @params business_id,business_url
export const updateBusinessData = (params) => {
  return axiosOnboardInstance.post(`${API_updateBusinessData}`, params);
};

// POST @get-customer-notification API
// @params
export const getCustomerNotification = () => {
  return axiosOnboardInstance.post(`${API_getCustomerNotification}`);
};

// POST @update-customer-notification
// @params email_notification, sms_notification, whatsapp_notification, push_notification
export const updateCustomerNotification = (params) => {
  return axiosOnboardInstance.post(`${API_updateCustomerNotification}`, params);
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
  addContact,
  getConatcts,
  deleteContact,
  favContact,
  updateBusinessUrl,
  generateNewQrCode,
  getCustomerNotification,
  updateCustomerNotification,
  cardsList,
  updateBusinessData,
  getBankList,
  deleteBank,
  getCardColor,
};
