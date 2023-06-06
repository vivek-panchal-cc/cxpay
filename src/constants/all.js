import {
  IconActReqCancel,
  IconActReqDecline,
  IconActReqReceive,
  IconActReqSent,
  IconNotifyContactAccept,
  IconNotifyMoneyRecieved,
  IconNotifyMoneyRequest,
  IconNotifyMoneySent,
  IconNotifyMoneySentFailed,
} from "styles/svgs";

// Expressions
const exp0ContainWhitespace = /^\S*$/;
const exp0ContainWordPassword = /^((?!password).)*$/gim;
const expContainCapitalLetter = /^(?=.*[A-Z])/;
const expContainNumber = /^(?=.*\d)/;
const expContainSpecialChar = /^(?=.*[!@#$%^&*])/;
const validFileExtensions = {
  image: ["jpg", "png", "jpeg", "svg", "heif", "hevc"],
};

// Test Functions
const regexNotContainWhitespace = (testStr) =>
  new RegExp(exp0ContainWhitespace).test(testStr);

const regexNotContainWordPassword = (testStr) =>
  new RegExp(exp0ContainWordPassword).test(testStr);

const regexContainCapitalLetter = (testStr) =>
  new RegExp(expContainCapitalLetter).test(testStr);

const regexContainNumber = (testStr) =>
  new RegExp(expContainNumber).test(testStr);

const regexContainSpecialCharacter = (testStr) =>
  new RegExp(expContainSpecialChar).test(testStr);

// regex
const url_regex =
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

// To check file type
const isValidFileType = (fileName, fileType) => {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
};

const otpCounterTime = 180;

// theme colors
const THEME_COLORS = ["light_blue"];

// To check file size
// const validFileSize = "5MB";
// const fileUploadLimit = (file, fileSize) => {
//   return file && validFileSize[file].indexOf(file.split(".").pop()) > -1;
// };

// CXPAY LOGO
const CXPAY_LOGO = "/assets/images/cxpay_me_logo.png";
const CXPAY_SHADOW_LOGO = "/assets/images/cxpay_me_shadow_logo.png";

// Fund account flow constants
const FUND_CARD = "credit-card";
const FUND_CASH = "cash-credit";
const FUND_BANK = "bank-transfer";
const MAX_PAYMENT_CONTACTS = 30;
const MAX_REQUEST_CONTACTS = 30;
const MAX_GROUP_MEMBERS = 30;

// Rename Keys with provided alias
const renameKeys = (keysMap, object) =>
  Object.keys(object).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: object[key] },
    }),
    {}
  );

// Notification types constants
const NOTIFY_REQUEST = "request";
const NOTIFY_RECEIVE = "receive";
const NOTIFY_PAY_FAIL = "payment_fail";
const NOTIFY_PAY_COMPLETE = "payment_completed";
const NOTIFY_CON_REGISTER = "contact_register";

// Notifications Type Constants
const notificationType = {
  [NOTIFY_REQUEST]: {
    icon: IconNotifyMoneyRequest,
    redirect: "/activities",
  },
  [NOTIFY_RECEIVE]: {
    icon: IconNotifyMoneyRecieved,
    redirect: "/activities",
  },
  [NOTIFY_PAY_FAIL]: {
    icon: IconNotifyMoneySentFailed,
    redirect: "/activities",
  },
  [NOTIFY_PAY_COMPLETE]: {
    icon: IconNotifyMoneySent,
    redirect: "/activities",
  },
  [NOTIFY_CON_REGISTER]: {
    icon: IconNotifyContactAccept,
    redirect: "/contacts",
  },
  "": {
    icon: "",
    redirect: "/wallet",
  },
};

const ACT_TYPE_REQUEST = "request";
const ACT_TYPE_TRANSACTION = "transaction";
const ACT_REQUEST_SEND = "send";
const ACT_REQUEST_RECEIVE = "receive";
const ACT_TRANSACT_CREDIT = "credit";
const ACT_TRANSACT_DEBIT = "debit";
const ACT_STATUS_PENDING = "PENDING";
const ACT_STATUS_DECLINED = "DECLINED";
const ACT_STATUS_CANCELLED = "CANCELLED";
const ACT_STATUS_PAID = "PAID";

const activityConsts = {
  [ACT_TYPE_REQUEST]: {
    [ACT_REQUEST_SEND]: {
      [ACT_STATUS_PENDING]: {
        iconStatus: <IconActReqSent />,
        iconAmount: "",
        classStatus: "btn-blue",
        classBg: "cx-bg-blue",
        classText: "",
        textStatus: "Request Sent",
        desc: "Requesting money from YYYY",
      },
      [ACT_STATUS_DECLINED]: {
        iconStatus: <IconActReqDecline />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Declined",
        desc: "Requested money from YYYY",
      },
      [ACT_STATUS_CANCELLED]: {
        iconStatus: <IconActReqCancel />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Cancelled",
        desc: "Requested money from YYYY",
      },
      [ACT_STATUS_PAID]: {
        iconStatus: <IconActReqSent />,
        iconAmount: "+",
        classStatus: "btn-blue",
        classBg: "cx-bg-blue",
        classText: "cx-color-green",
        textStatus: "Request Sent",
        desc: "Requested money from YYYY",
      },
    },
    [ACT_REQUEST_RECEIVE]: {
      [ACT_STATUS_PENDING]: {
        iconStatus: <IconActReqReceive />,
        iconAmount: "",
        classStatus: "btn-green",
        classBg: "cx-bg-green",
        classText: "",
        textStatus: "Request received",
        desc: "YYYY requesting money from you",
      },
      [ACT_STATUS_DECLINED]: {
        iconStatus: <IconActReqDecline />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Declined",
        desc: "YYYY requested money from you",
      },
      [ACT_STATUS_CANCELLED]: {
        iconStatus: <IconActReqCancel />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Cancelled",
        desc: "YYYY requested money from you",
      },
      [ACT_STATUS_PAID]: {
        iconStatus: <IconActReqReceive />,
        iconAmount: "-",
        classStatus: "btn-green",
        classBg: "cx-bg-green",
        classText: "",
        textStatus: "Request received",
        desc: "YYYY requested money from you",
      },
    },
  },
  [ACT_TYPE_TRANSACTION]: {
    [ACT_TRANSACT_CREDIT]: {
      [ACT_STATUS_PAID]: {
        iconStatus: "",
        iconAmount: "+",
        classStatus: "btn-green",
        classBg: "cx-bg-green",
        classText: "cx-color-green",
        classDetailStatus: "cx-color-green",
        textStatus: "Receive",
        textDetailStatus: "Amount Credited",
        desc: "From YYYY",
      },
    },
    [ACT_TRANSACT_DEBIT]: {
      [ACT_STATUS_PAID]: {
        iconStatus: "",
        iconAmount: "-",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "",
        classDetailStatus: "cx-color-red",
        textStatus: "Sent",
        textDetailStatus: "Amount Debited",
        desc: "To YYYY",
      },
    },
  },
};

// Currency Symbol
const CURRENCY_SYMBOL = "ANG";

// Buffer Time for schedule
const SCHEDULE_BUFFER = 5;

// Charges Types
const CHARGES_TYPE_WW = "pay_type=WW";
const CHARGES_TYPE_PL = "pay_type=PL";

// Withdraw options tabs list
const WITHDRAW_OPTIONS_TABS_LIST = [
  { title: "Card", url: "/wallet/withdrawals-card" },
  { title: "Bank", url: "/wallet/withdrawals-bank" },
];

export {
  exp0ContainWhitespace,
  exp0ContainWordPassword,
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  validFileExtensions,
  otpCounterTime,
  url_regex,
  notificationType,
  activityConsts,
  THEME_COLORS,
  CURRENCY_SYMBOL,
  SCHEDULE_BUFFER,
  FUND_CARD,
  FUND_CASH,
  FUND_BANK,
  MAX_GROUP_MEMBERS,
  MAX_PAYMENT_CONTACTS,
  MAX_REQUEST_CONTACTS,
  CXPAY_LOGO,
  CXPAY_SHADOW_LOGO,
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  ACT_REQUEST_SEND,
  ACT_REQUEST_RECEIVE,
  ACT_TRANSACT_CREDIT,
  ACT_TRANSACT_DEBIT,
  ACT_STATUS_PENDING,
  ACT_STATUS_DECLINED,
  ACT_STATUS_CANCELLED,
  ACT_STATUS_PAID,
  NOTIFY_REQUEST,
  NOTIFY_RECEIVE,
  NOTIFY_PAY_FAIL,
  NOTIFY_PAY_COMPLETE,
  NOTIFY_CON_REGISTER,
  CHARGES_TYPE_WW,
  CHARGES_TYPE_PL,
  WITHDRAW_OPTIONS_TABS_LIST,
};
export {
  regexContainCapitalLetter,
  regexContainNumber,
  regexContainSpecialCharacter,
  isValidFileType,
  // fileUploadLimit,
  // ~NOT
  regexNotContainWhitespace,
  regexNotContainWordPassword,
  renameKeys,
};
