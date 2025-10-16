import { storageRequest } from "helpers/storageRequests";
import React, { useEffect, useMemo, useState } from "react";
import useCountriesCities from "hooks/useCountriesCities";

const initialValues = {
  email: "",
  mobile_number: "",
  login_otp: "",
  country_code: "",
  token: "",
  password_token: "",
};

export const ForgotPasswordContext = React.createContext(initialValues);

const ForgotPasswordProvider = ({ children }) => {
  const creds = storageRequest.getPasswordCredsFromStorage();
  const [forgorPasswordCreds, setForgotPasswordCreds] = useState(
    creds || initialValues
  );
  const [countries, cities] = useCountriesCities(true);
  const forgotPasswordValues = useMemo(
    () => ({ forgorPasswordCreds, setForgotPasswordCreds }),
    [forgorPasswordCreds, setForgotPasswordCreds]
  );

  useEffect(() => {
    const creds = storageRequest.getPasswordCredsFromStorage();
    if (creds) return setForgotPasswordCreds(creds);
    setForgotPasswordCreds(initialValues);
  }, []);

  useEffect(() => {
    storageRequest.setPasswordCredsToStorage(forgorPasswordCreds);
  }, [forgorPasswordCreds]);

  useEffect(() => {
    if (!countries || !cities) return;
    setForgotPasswordCreds((cs) => ({
      ...cs,
      countryList: countries,
      cityList: cities,
    }));
  }, [countries, cities]);

  return (
    <ForgotPasswordContext.Provider value={forgotPasswordValues}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export default ForgotPasswordProvider;
