import {
  IconNotifyContact,
  IconNotifyMoneySent,
  IconNotifyMoneySentFailed,
} from "styles/svgs";

// Expressions
const exp0ContainWhitespace = /^\S*$/;
const exp0ContainWordPassword = /^((?!password).)*$/gim;
const expContainCapitalLetter = /^(?=.*[A-Z])/;
const expContainNumber = /^(?=.*[0-9])/;
const expContainSpecialChar = /^(?=.*[!@#\$%\^&\*])/;
const validFileExtensions = {
  image: ["jpg", "png", "jpeg", "svg", "heif", "hevc"],
};
// const validFileSize = "5MB";
const otpCounterTime = 180;
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

// theme colors
const THEME_COLORS = ["light_blue"];

// To check file size
// const fileUploadLimit = (file, fileSize) => {
//   return file && validFileSize[file].indexOf(file.split(".").pop()) > -1;
// };

// Fund account flow constants
const FUND_CARD = "credit-card";
const FUND_CASH = "cash-credit";
const FUND_BANK = "bank-transfer";
const MAX_PAYMENT_CONTACTS = 30;
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
    icon: IconNotifyMoneySent,
    redirect: "/contacts",
  },
  receive: {
    icon: IconNotifyMoneySent,
    redirect: "/contacts",
  },
  payment_fail: {
    icon: IconNotifyMoneySentFailed,
    redirect: "/contacts",
  },
  contact_register: {
    icon: IconNotifyContact,
    redirect: "/contacts",
  },
  "": {
    icon: "",
    redirect: "/wallet",
  },
};

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
  FUND_CARD,
  FUND_CASH,
  FUND_BANK,
  MAX_GROUP_MEMBERS,
  MAX_PAYMENT_CONTACTS,
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
