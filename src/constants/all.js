// Expressions
const exp0ContainWhitespace = /^\S*$/;
const exp0ContainWordPassword = /^((?!password).)*$/gim;
const expContainCapitalLetter = /^(?=.*[A-Z])/;
const expContainNumber = /^(?=.*[0-9])/;
const expContainSpecialChar = /^(?=.*[!@#\$%\^&\*])/;
const validFileExtensions = {
  image: ["jpg", "png", "jpeg", "svg"],
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
//
//   return file && validFileSize[file].indexOf(file.split(".").pop()) > -1;
// };

export {
  exp0ContainWhitespace,
  exp0ContainWordPassword,
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  validFileExtensions,
  otpCounterTime,
  url_regex,
  THEME_COLORS,
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
};
