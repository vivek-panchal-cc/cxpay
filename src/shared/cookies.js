export const getCookie = (n) => {
  const a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
  return a ? a[1] : "";
};

export const deleteCookie = () => {
  document.cookie =
    "auth._token.Bearer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
