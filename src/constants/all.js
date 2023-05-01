import {
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
  THEME_COLORS,
  CURRENCY_SYMBOL,
  FUND_CARD,
  FUND_CASH,
  FUND_BANK,
  MAX_GROUP_MEMBERS,
  MAX_PAYMENT_CONTACTS,
  MAX_REQUEST_CONTACTS,
  CXPAY_LOGO,
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
