const AUTH_KEY = "CXPAY_AUTH";
const STORAGE_KEY = "CXPAY_SIGNUP_CREDS";
const LOGIN_STORAGE_KEY = "CXPAY_LOGIN_CREDS";
const TIMEZONE_STORAGE_KEY = "CXPAY_TIMEZONE_CREDS";

// LOCAL STORAGE set Auth data
export const setAuth = (token) => {
  if (!localStorage) return false;
  localStorage.setItem(AUTH_KEY, token);
  return true;
};

// LOCAL STORAGE set Auth data
export const getAuth = () => {
  if (!localStorage) return false;
  const token = localStorage.getItem(AUTH_KEY);
  if (token === "undefined" || token === "null" || !token) return null;
  return token;
};

// LOCAL STORAGE remove Auth data
export const removeAuth = () => {
  if (localStorage) return localStorage.removeItem(AUTH_KEY);
};

// LOCAL STORAGE get Signup creds
const getCredsFromtStorage = () => {
  if (!localStorage) return null;
  const creds = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(creds);
};

// LOCAL STORAGE set Signup creds
const setCredsToStorage = (creds) => {
  if (!localStorage) return null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
};

// LOCAL STORAGE remove Signup creds
const removeSignupCreds = () => {
  if (!localStorage) return null;
  localStorage.removeItem(STORAGE_KEY);
};

// LOCAL STORAGE get Login creds
const getLoginCreds = () => {
  if (!localStorage) return null;
  const creds = localStorage.getItem(LOGIN_STORAGE_KEY);
  return JSON.parse(creds);
};

// LOCAL STORAGE set Login creds
const setLoginCredsToStorage = (creds) => {
  if (!localStorage) return null;
  localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(creds));
};

// LOCAL STORAGE get TimeZone
const getTimeZone = () => {
  if (!localStorage) return null;
  const creds = localStorage.getItem(TIMEZONE_STORAGE_KEY);
  return JSON.parse(creds);
};

// LOCAL STORAGE set TimeZone
const setTimeZoneStorage = (creds) => {
  if (!localStorage) return null;
  localStorage.setItem(TIMEZONE_STORAGE_KEY, JSON.stringify(creds));
};

// LOCAL STORAGE remove TimeZone
const removeTimeZone = () => {
  if (localStorage) return localStorage.removeItem(TIMEZONE_STORAGE_KEY);
};

export const storageRequest = {
  setAuth,
  getAuth,
  removeAuth,
  getCredsFromtStorage,
  setCredsToStorage,
  removeSignupCreds,
  getLoginCreds,
  setLoginCredsToStorage,
  getTimeZone,
  setTimeZoneStorage,
  removeTimeZone,
};
