import { apiRequest } from "helpers/apiRequests";
import { storageRequest } from "helpers/storageRequests";
import React, { useContext, useEffect, useState } from "react";
import { LoaderContext } from "./loaderContext";
import useCountriesCities from "hooks/useCountriesCities";

const initialValues = {
  step: 0,
  mobile_number: "",
  user_otp: "",
  user_type: "",
  country_code: "",
  countryList: [],
  cityList: [],
};

export const SignupContext = React.createContext(initialValues);

const SignupProvider = ({ children }) => {
  const creds = storageRequest.getCredsFromtStorage();
  const [signUpCreds, setSignUpCreds] = useState(creds || initialValues);
  const [countries, cities] = useCountriesCities();

  useEffect(() => {
    const creds = storageRequest.getCredsFromtStorage();
    if (creds) return setSignUpCreds(creds);
    setSignUpCreds(initialValues);
  }, []);

  useEffect(() => {
    storageRequest.setCredsToStorage(signUpCreds);
  }, [signUpCreds]);

  useEffect(() => {
    if (!countries || !cities) return;
    setSignUpCreds((cs) => ({
      ...cs,
      countryList: countries,
      cityList: cities,
    }));
  }, [countries, cities]);

  return (
    <SignupContext.Provider value={{ signUpCreds, setSignUpCreds }}>
      {children}
    </SignupContext.Provider>
  );
};

export default SignupProvider;
