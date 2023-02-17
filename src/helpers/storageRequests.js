const AUTH_KEY = "CYPAY_AUTH";

// LOCAL STORAGE set data
export const setAuth = (token) => {
  if (!sessionStorage) return false;
  sessionStorage.setItem(AUTH_KEY, token);
  return true;
};

// LOCAL STORAGE set data
export const getAuth = () => {
  if (!sessionStorage) return false;
  const token = sessionStorage.getItem(AUTH_KEY);
  if (token === "undefined" || token === "null" || !token) return null;
  return token;
};

// LOCAL STORAGE set data
export const removeAuth = () => {
  if (sessionStorage) return sessionStorage.removeItem(AUTH_KEY);
};

export const storageRequest = { setAuth, getAuth, removeAuth };
