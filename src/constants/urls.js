// customer-login urls
export const API_LOGIN_LOGIN = "/login";
export const API_LOGIN_LOGOUT = "/logout";
export const API_LOGIN_LOGIN_OTP = "/login-otp";
export const API_LOGIN_LOGIN_OTP_VERIFY = "/login-otp-verify";
export const API_LOGIN_PASSWORD_CHANGE = "/password-change";
export const API_LOGIN_GENERATE_FORGOT_PASSWORD_OTP =
  "/generate-forgot-password-otp";
export const API_LOGIN_VERIFY_FORGOT_PASSWORD_OTP =
  "/verify-forgot-password-otp";
export const API_LOGIN_UPDATE_FORGOT_PASSWORD_OTP = "/update-forgot-password";
export const API_LOGIN_RESEND_LOGIN_OTP = "/login-otp-resend";
export const API_LOGIN_RESEND_FORGOT_PASSWORD_OTP =
  "/resend-forgot-password-otp";
export const API_LOGIN_REFRESH_TOKEN = "/refresh-token";
export const API_CHECK_CUSTOMER_KYC = "check-customer-kyc"
export const API_UPDATE_CUSTOMER_KYC = "update-customer-kyc"
export const API_GET_FAQ_LIST = "/api/faq/get-list"

// customer-onboard urls
export const API_ONBOARD_VERIFY_MOBILE_NUMBER = "/register-mobile";
export const API_ONBOARD_VERIFY_REGISTER_OTP = "/verify-register-otp";
export const API_ONBOARD_REGISTER_USER = "/register-user";
export const API_ONBOARD_GET_PROFILE = "/get-profile";
export const API_ONBOARD_UPDATE_USER = "/update-user";
export const API_ONBOARD_ADD_CARD = "/add-card";
export const API_ONBOARD_ADD_BANK = "/add-bank";
export const API_ONBOARD_UPDATE_BANK = "/update-bank";
export const API_ONBOARD_ADD_CONTACT = "/add-contact";
export const API_ONBOARD_GET_CONTACT_LIST = "/contacts-list";
export const API_ONBOARD_DELETE_CONTACT = "/delete-contact";
export const API_ONBOARD_FAV_CONTACT = "/mark-as-favourite";
export const API_ONBOARD_GET_COUNTRY = "/get-country";
export const API_ONBOARD_RESEND_REGISTER_OTP = "/resend-register-otp";
export const API_ONBOARD_UPDATE_BUSINESS_URL = "/update-business-url";
export const API_ONBOARD_GENERATE_QR_CODE = "/generate-new-qrcode";
export const API_ONBOARD_CARDS_LIST = "/cards-list";
export const API_ONBOARD_BANK_LIST = "/banks-list";
export const API_ONBOARD_DELETE_BANK = "/delete-bank";
export const API_ONBOARD_DELETE_CARD = "/delete-card";
export const API_ONBOARD_GET_CARD_COLOR = "/get-card-color";
export const API_ONBOARD_UPDATE_BUSINESS_DATA =
  "/update-customer-business-data";
export const API_ONBOARD_GET_CUSTOMER_NOTIFICATION =
  "/get-customer-notification";
export const API_ONBOARD_UPDATE_CUSTOMER_NOTIFICATION =
  "/update-customer-notification";
export const API_ONBOARD_UPDATE_CARD = "/update-card";
export const API_ONBOARD_CARD_MARK_AS_DEFAULT = "/card-mark-as-default";
export const API_ONBOARD_BANK_MARK_AS_DEFAULT = "/bank-mark-as-default";
export const API_ONBOARD_GET_INVITE_CONCAT_LIST = "/get-active-contact-list";
export const API_ONBOARD_ADD_GROUP = "/add-group";
export const API_ONBOARD_GET_GROUP_LIST = "/groups-list";
export const API_ONBOARD_DELETE_GROUP = "/delete-group";
export const API_ONBOARD_GET_GROUP_DETAIL = "/groups-details";
export const API_ONBOARD_DELETE_GROUP_MEMBER = "/delete-contact-from-group";
export const API_ONBOARD_UPDATE_GROUP = "/update-group";
export const API_ONBOARD_GET_REMAINING_GROUP_CONTACT = "/get-remain-contacts";
export const API_ONBOARD_INVITED_CONTACT_LIST = "/invited-contacts-list";
export const API_ONBOARD_GET_ALL_NOTIFICATIONS = "/get-all-notifications";
export const API_ONBOARD_MARK_AS_READ = "/mark-as-read";
export const API_ONBOARD_DELETE_NOTIFICATIONS = "/delete-notifications";
export const API_ONBOARD_GET_COUNTRY_BANKS = "/get-country-banks";
export const API_ONBOARD_RESEND_VERIFY_EMAIL = "/resend-verify-email";
export const API_ONBOARD_DEACTIVATE_ACCOUNT = "/deactivate-account";
export const API_ONBOARD_DEACTIVATE_ACCOUNT_AGENT = "/agent-delete";
export const API_ONBOARD_CREATE_SCHEDULE_PAYMENT = "/create-schedule-payment";
export const API_ONBOARD_LIST_SCHEDULE_PAYMENT = "/list-schedule-payment";
export const API_ONBOARD_DELETE_SCHEDULE_PAYMENT = "/delete-schedule-payment";
export const API_ONBOARD_UPDATE_SCHEDULE_PAYMENT = "/update-schedule-payment";
export const API_ONBOARD_VIEW_SCHEDULE_PAYMENT = "/view-schedule-payment";
export const API_ONBOARD_GET_ALL_SYSTEM_OPTIONS = "/get-all-system-options";
export const API_ONBOARD_MARK_ALL_AS_READ_NOTIFICATIONS = "/mark-all-as-read";
export const API_ONBOARD_WALLET_TRANSFER_SCHEDULE_OTP = "/create-schedule-payment-otp";
export const API_ONBOARD_RESEND_SCHEDULE_PAYMENT_OTP = "/resend-schedule-payment-otp";
export const API_ONBOARD_CREATE_CHANGE_MOBILE_OTP = "/create-change-mobile-otp"
export const API_ONBOARD_VERIFY_CHANGE_MOBILE_OTP = "verify-change-mobile-otp"
export const API_ONBOARD_MANUAL_KYC_PROCESS = "manual-kyc-process"

// customer-admin urls
export const API_ADMIN_CMS_PAGE = "/api/cms-page/details";
export const API_ADMIN_CMS_LIST = "/api/cms-page/displayed-page-list";

// customer-transaction Urls
export const API_TRANSACTION_ADD_FUND = "/add-fund";
export const API_TRANSACTION_GET_BANK_DETAILS = "/get-bank-details";
export const API_TRANSACTION_INITIATE_MANUAL_FUND_ADD =
  "/initiate-manual-fund-add";
export const API_TRANSACTION_GET_BALANCE = "/get-balance";
export const API_TRANSACTION_WALLET_TRANSFER_OTP = "/wallet-transfer-otp";
export const API_TRANSACTION_WALLET_PERSONAL_OTP_VERIFY =
  "/wallet-personal-otp-verify";
export const API_TRANSACTION_RESEND_WALLET_TRANSFER_OTP =
  "/resend-wallet-transfer-otp";
export const API_TRANSACTION_GET_CHARGES = "/get-charges";
export const API_TRANSACTION_SEND_PAYMENT_REQUEST = "/send-payment-request";
export const API_TRANSACTION_ACTIVITY_LIST = "/activity-list";
export const API_TRANSACTION_GET_ACTIVITY_DETAILS = "/get-activity-details";
export const API_TRANSACTION_CHANGE_REQUEST_STATUS = "/change-request-status";
export const API_TRANSACTION_GET_CHART_DATA = "/get-chart-data";
export const API_TRANSACTION_GET_PRINT_DETAILS = "/get-print-details";

export const API_TRANSACTION_BANK_WITHDRAW_LIST = "/bank-withdraw-list";
export const API_TRANSACTION_BANK_WITHDRAW_DETAILS = "/bank-withdraw-detail";
export const API_TRANSACTION_INITIATE_WITHDRAW_REQUEST =
  "/initiate-withdraw-request";
export const API_TRANSACTION_CANCEL_WITHDRAW_REQUEST =
  "/cancel-withdraw-request";
export const API_TRANSACTION_CARD_TRANSACTIONS_LIST = "/card-transactions-list";
export const API_TRANSACTION_CARD_TRANSACTIONS_DETAILS =
  "/card-transaction-details";
export const API_TRANSACTION_INITIATE_CARD_WITHDRAW = "/initiate-card-withdraw";
export const API_TRANSACTION_AVAILABLE_CARD_BALANCE = "/available-card-balance";
export const API_TRANSACTION_VIEW_BANK_WITHDRAW_RECEIPT =
  "/view-bank-withdraw-receipt";
export const API_TRANSACTION_GET_CUSTOMER_DETAIL = "/get-customer-detail";
export const API_TRANSACTION_GET_AGENT_WISE_CARD_LIST = "/agent-wise-card-list";
export const API_TRANSACTION_AGENT_TOP_UPS = "/agent-topups";
export const API_TRANSACTION_GET_TOPUP_PRINT_DETAILS =
  "/get-topup-print-details";
export const API_TRANSACTION_GET_TOPUP_TRANSACTION_HISTORY =
  "/topup-transaction-history";
export const API_TRANSACTION_GET_TOPUP_ACTIVITY_DETAILS =
  "/topup-transaction-details";
export const API_TRANSACTION_MONTHLY_RECHARGE_TOTAL = "/agent-recharge-total";

//Recurring
export const API_TRANSACTION_CREATE_RECURRING_PAYMENT =
  "/create-recurring-schedule-payment";
export const API_TRANSACTION_UPDATE_RECURRING_PAYMENT =
  "/update-recurring-schedule-payment";
export const API_TRANSACTION_DELETE_RECURRING_PAYMENT =
  "/delete-recurring-schedule-payment";
export const API_TRANSACTION_LIST_RECURRING_PAYMENT =
  "/list-recurring-schedule-payment";
export const API_TRANSACTION_VIEW_RECURRING_PAYMENT =
  "/view-recurring-schedule-payment";
export const API_TRANSACTION_WALLET_TRANSFER_RECURRING_OTP = "/create-recurring-schedule-payment-otp";
export const API_TRANSACTION_RESEND_RECURRING_PAYMENT_OTP =
  "/resend-recurring-schedule-payment-otp";

//Reserved Amount
export const API_RESERVED_AMOUNT_LIST = "/reserved-amount-list";

// URLs for payments redirects and responses
export const API_TRANSACTION_DATE_COLLECTED_ORIGIN =
  process.env.REACT_APP_API_CYBERSOURCE_ORIGIN_URL ||
  "https://centinelapistag.cardinalcommerce.com";
export const API_TRANSACTION_PAYMENT_RETURN_ORIGIN =
  process.env.REACT_APP_API_PAYMENT_RETURN || "http://3.140.192.108:8083";
