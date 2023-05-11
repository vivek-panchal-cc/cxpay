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
  ///^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

// To check file type
const isValidFileType = (fileName, fileType) => {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
};

// const validFileSize = "5MB";
const otpCounterTime = 180;

// theme colors
const THEME_COLORS = ["light_blue"];

// To check file size
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

// Notifications Type Constants
const notificationType = {
  request: {
    icon: IconNotifyMoneyRequest,
    redirect: "/wallet",
  },
  receive: {
    icon: IconNotifyMoneyRecieved,
    redirect: "/wallet",
  },
  payment_fail: {
    icon: IconNotifyMoneySentFailed,
    redirect: "/wallet",
  },
  payment_completed: {
    icon: IconNotifyMoneySent,
    redirect: "/wallet",
  },
  contact_register: {
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
        desc: "Requested money from YYYY",
      },
      [ACT_STATUS_DECLINED]: {
        iconStatus: <IconActReqDecline />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Declined",
        desc: "Requested money from YYYY",
      },
      [ACT_STATUS_CANCELLED]: {
        iconStatus: <IconActReqCancel />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Cancelled",
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
        desc: "YYYY requested money from you",
      },
      [ACT_STATUS_DECLINED]: {
        iconStatus: <IconActReqDecline />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Declined",
        desc: "YYYY requested money from you",
      },
      [ACT_STATUS_CANCELLED]: {
        iconStatus: <IconActReqCancel />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Cancelled",
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
        textStatus: "Receive",
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
        textStatus: "Sent",
        desc: "To YYYY",
      },
    },
  },
};

// Currency Symbol
const CURRENCY_SYMBOL = "ANG";

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
  ACT_STATUS_PENDING,
  ACT_STATUS_DECLINED,
  ACT_STATUS_CANCELLED,
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
