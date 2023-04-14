import * as apiUrl from "constants/urls";
import {
  axiosLoginInstance,
  axiosOnboardInstance,
  axiosTransactionInstance,
} from "plugin/axios";

// LOGIN SERVICES
const API_login = apiUrl.API_LOGIN_LOGIN;
const API_logout = apiUrl.API_LOGIN_LOGOUT;
const API_loginOtp = apiUrl.API_LOGIN_LOGIN_OTP;
const API_LoginOtpVerify = apiUrl.API_LOGIN_LOGIN_OTP_VERIFY;
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
const API_updateBank = apiUrl.API_ONBOARD_UPDATE_BANK;
const API_addCard = apiUrl.API_ONBOARD_ADD_CARD;
const API_deleteCard = apiUrl.API_ONBOARD_DELETE_CARD;
const API_updateCard = apiUrl.API_ONBOARD_UPDATE_CARD;
const API_getCountry = apiUrl.API_ONBOARD_GET_COUNTRY;
const API_resendRegisterOtp = apiUrl.API_ONBOARD_RESEND_REGISTER_OTP;
const API_updateBusinessUrl = apiUrl.API_ONBOARD_UPDATE_BUSINESS_URL;
const API_generateNewQrCode = apiUrl.API_ONBOARD_GENERATE_QR_CODE;
const API_cardsList = apiUrl.API_ONBOARD_CARDS_LIST;
const API_bankList = apiUrl.API_ONBOARD_BANK_LIST;
const API_deleteBank = apiUrl.API_ONBOARD_DELETE_BANK;
const API_getCardColor = apiUrl.API_ONBOARD_GET_CARD_COLOR;
const API_cardMarkAsDefault = apiUrl.API_ONBOARD_CARD_MARK_AS_DEFAULT;
const API_bankMarkAsDefault = apiUrl.API_ONBOARD_BANK_MARK_AS_DEFAULT;
const API_getCharges = apiUrl.API_ONBOARD_GET_CHARGES;
const API_updateBusinessData = apiUrl.API_ONBOARD_UPDATE_BUSINESS_DATA;
const API_addContact = apiUrl.API_ONBOARD_ADD_CONTACT;
const API_getConatcts = apiUrl.API_ONBOARD_GET_CONTACT_LIST;
const API_deleteContact = apiUrl.API_ONBOARD_DELETE_CONTACT;
const API_favContact = apiUrl.API_ONBOARD_FAV_CONTACT;
const API_getCustomerNotification =
  apiUrl.API_ONBOARD_GET_CUSTOMER_NOTIFICATION;
const API_updateCustomerNotification =
  apiUrl.API_ONBOARD_UPDATE_CUSTOMER_NOTIFICATION;
const API_invitedContactList = apiUrl.API_ONBOARD_INVITED_CONTACT_LIST;
const API_getAllNotifications = apiUrl.API_ONBOARD_GET_ALL_NOTIFICATIONS;
const API_getInviteContactList = apiUrl.API_ONBOARD_GET_INVITE_CONCAT_LIST;
const API_addGroup = apiUrl.API_ONBOARD_ADD_GROUP;
const API_groupsList = apiUrl.API_ONBOARD_GET_GROUP_LIST;
const API_deleteGroup = apiUrl.API_ONBOARD_DELETE_GROUP;
const API_getGroupDetail = apiUrl.API_ONBOARD_GET_GROUP_DETAIL;
const API_deleteGroupMember = apiUrl.API_ONBOARD_DELETE_GROUP_MEMBER;
const API_updateGroup = apiUrl.API_ONBOARD_UPDATE_GROUP;
const API_getRemainingGroupContact =
  apiUrl.API_ONBOARD_GET_REMAINING_GROUP_CONTACT;
const API_getCountryBanks = apiUrl.API_ONBOARD_GET_COUNTRY_BANKS;
const API_resendVerifyEmail = apiUrl.API_ONBOARD_RESEND_VERIFY_EMAIL;

// TRANSACTION SERVICES
const API_addFund = apiUrl.API_TRANSACTION_ADD_FUND;
const API_getBalance = apiUrl.API_TRANSACTION_GET_BALANCE;
const API_walletTransferOtp = apiUrl.API_TRANSACTION_WALLET_TRANSFER_OTP;
const API_walletPersonalOtpVerify =
  apiUrl.API_TRANSACTION_WALLET_PERSONAL_OTP_VERIFY;
const API_resendWalletTransferOtp =
  apiUrl.API_TRANSACTION_RESEND_WALLET_TRANSFER_OTP;
//  -------------------------------------------- LOGIN ------------------------------------------------------------------------------------------>
//  ------------------------------------------------------------------------------------------------------------------------------------------------>

// POST @login API
// @params country_code, user_name, password
export const login = (creds) => {
  return axiosLoginInstance.post(`${API_login}`, creds);
};

// POST @logout API
// @params auth_token
export const logout = () => {
  return axiosLoginInstance.post(`${API_logout}`);
};

// POST @login-otp API
// @params mobile_number, country_code
export const loginOtp = (params) => {
  return axiosLoginInstance.post(`${API_loginOtp}`, params);
};

// POST @login-otp-verify API
// @params mobile_number, user_otp, country_code
export const loginOtpVerify = (params) => {
  return axiosLoginInstance.post(`${API_LoginOtpVerify}`, params);
};

// POST @password-change API
// @params current_password, new_password, confirm_password
export const passwordChange = (params) => {
  return axiosLoginInstance.post(`${API_passwordChange}`, params);
};

// POST @generate-forgot-password-otp-change API
// @params country_code, mobile_number
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

// POST @resend-verify-email API
// @params token
export const resendVerifyEmail = () => {
  return axiosOnboardInstance.post(`${API_resendVerifyEmail}`);
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
// @params bank_number, routing_number, account_type (current,savings), bank_name,
//         bank_holder_first_name, bank_holder_last_name, city, country, email
export const linkBank = (params) => {
  return axiosOnboardInstance.post(`${API_linkBank}`, params);
};

// POST @add-card API
// @params card_number, expiry_date(mm/yyyy), billing_address, security_code, color, image,
//         card_holder_first_name, card_holder_last_name, city, country, email
export const addCard = (params) => {
  return axiosOnboardInstance.post(`${API_addCard}`, params);
};

// POST @delete-card API
// @params id(card id)
export const deleteCard = (params) => {
  return axiosOnboardInstance.post(`${API_deleteCard}`, params);
};

// POST @update-card API
// @params id(card id), image, color, city, country, email
export const updateCard = (params) => {
  return axiosOnboardInstance.post(`${API_updateCard}`, params);
};

// POST @card-mark-as-default API
// @params card_id
export const cardMarkAsDefault = (params) => {
  return axiosOnboardInstance.post(`${API_cardMarkAsDefault}`, params);
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
// @params token
export const getBankList = () => {
  return axiosOnboardInstance.post(`${API_bankList}`);
};

// POST @get-country-banks API
// @params token
export const getCountryBanks = (params) => {
  return axiosOnboardInstance.post(`${API_getCountryBanks}`, params);
};

// POST @delete-bank
// @params id
export const deleteBank = (params) => {
  return axiosOnboardInstance.post(`${API_deleteBank}`, params);
};

// POST @update-bank
// @params id(bank id), bank_number, routing_number, account_type (current,savings), city, country, email
export const updateBank = (params) => {
  return axiosOnboardInstance.post(`${API_updateBank}`, params);
};

// POST @bank-mark-as-default API
// @params bank_id
export const bankMarkAsDefault = (params) => {
  return axiosOnboardInstance.post(`${API_bankMarkAsDefault}`, params);
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

//POST @get-contact-invite-list API
// @params
export const getInviteContactList = (params) => {
  return axiosOnboardInstance.post(`${API_getInviteContactList}`, params);
};

// POST @add-group API
// @params group_name,group_image,contact
export const addGroup = (params) => {
  return axiosOnboardInstance.post(`${API_addGroup}`, params);
};

//POST @group-list
// @params page,search
export const getGroupsList = (params) => {
  return axiosOnboardInstance.post(`${API_groupsList}`, params);
};

//POST @delete-group
// @params group_id
export const deleteGroup = (params) => {
  return axiosOnboardInstance.post(`${API_deleteGroup}`, params);
};

//POST @get-group-detail
// @params group_id
export const getGroupDetail = (params) => {
  return axiosOnboardInstance.post(`${API_getGroupDetail}`, params);
};
//POST @delete-group-member
// @params group_id,member_account_number[]
export const deleteGroupMember = (params) => {
  return axiosOnboardInstance.post(`${API_deleteGroupMember}`, params);
};

//POST @update-group
// @params group_id,group_name,group_image,contact[]
export const updateGroup = (params) => {
  return axiosOnboardInstance.post(`${API_updateGroup}`, params);
};

//POST @get-remaining-group-contact
//@params group_id
export const getRemainingGroupContact = (params) => {
  return axiosOnboardInstance.post(`${API_getRemainingGroupContact}`, params);
};
// POST @get-all-notifications
// @params page
export const getAllNotifications = (params) => {
  return axiosOnboardInstance.post(`${API_getAllNotifications}`, params);
};

// POST @invited-contacts-list API
// @params auth_token
export const invitedConatcts = (params) => {
  return axiosOnboardInstance.post(`${API_invitedContactList}`, params);
};

// GET @get-charges
// @params
export const getCharges = (params) => {
  return axiosOnboardInstance.get(`${API_getCharges}?${params}`);
};

// POST @add-fund
// @params transactionType, transactionAmount, txn_mode, card_number, expiry_date, billing_address,
//         save_card, card_holder_first_name, card_holder_last_name, city, country, email, card_id
export const addFund = (params) => {
  return axiosTransactionInstance.post(`${API_addFund}`, params);
};

// POST @get-balance
// @params
export const getBalance = () => {
  return axiosTransactionInstance.post(`${API_getBalance}`);
};

// POST @wallet-transfer-otp
// @params wallet, fees, total_amount, group_id
export const walletTransferOtp = (params) => {
  return axiosTransactionInstance.post(`${API_walletTransferOtp}`, params);
};

// POST @wallet-personal-otp-verify
// @params mobile_number, wallet_transfer_otp
export const walletPersonalOtpVerify = (params) => {
  return axiosTransactionInstance.post(
    `${API_walletPersonalOtpVerify}`,
    params
  );
};

// POST @resend-wallet-transfer-otp
// @params mobile_number
export const resendWalletTransferOtp = (params) => {
  return axiosTransactionInstance.post(
    `${API_resendWalletTransferOtp}`,
    params
  );
};

export const apiRequest = {
  login,
  logout,
  loginOtp,
  loginOtpVerify,
  getUserProfile,
  verifyMobileNumber,
  verifyRegisterOtp,
  registerUser,
  updateUser,
  passwordChange,
  generateForgotPasswordOtpChange,
  verifyForgotPasswordOtp,
  updateForgotPassword,
  linkBank,
  addCard,
  deleteCard,
  updateCard,
  cardMarkAsDefault,
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
  getAllNotifications,
  getCustomerNotification,
  updateCustomerNotification,
  cardsList,
  updateBusinessData,
  getBankList,
  getCountryBanks,
  deleteBank,
  updateBank,
  bankMarkAsDefault,
  getCardColor,
  getInviteContactList,
  addGroup,
  getGroupsList,
  deleteGroup,
  getGroupDetail,
  deleteGroupMember,
  updateGroup,
  getRemainingGroupContact,
  invitedConatcts,
  getCharges,
  addFund,
  getBalance,
  walletTransferOtp,
  walletPersonalOtpVerify,
  resendWalletTransferOtp,
  resendVerifyEmail,
};
