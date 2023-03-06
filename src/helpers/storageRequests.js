const AUTH_KEY = "CXPAY_AUTH";
const STORAGE_KEY = "CXPAY_SIGNUP_CREDS";

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

export const storageRequest = {
  setAuth,
  getAuth,
  removeAuth,
  getCredsFromtStorage,
  setCredsToStorage,
  removeSignupCreds,
};
