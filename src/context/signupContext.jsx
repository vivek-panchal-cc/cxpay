import { storageRequest } from "helpers/storageRequests";
import React, { useEffect, useMemo, useState } from "react";
import useCountriesCities from "hooks/useCountriesCities";

const initialValues = {
  step: 0,
  mobile_number: "",
  user_otp: "",
  user_type: "",
  country_code: "",
  selected_country_name: "",
  country_iso: "",
  countryList: [],
  cityList: [],
  // is_kyc: "",
  system_manual_kyc: "",
  kyc_approved_status: "",
};

export const SignupContext = React.createContext(initialValues);

const SignupProvider = ({ children }) => {
  const creds = storageRequest.getCredsFromtStorage();
  const [signUpCreds, setSignUpCreds] = useState(creds || initialValues);
  const [countries, cities] = useCountriesCities();
  const signupValues = useMemo(
    () => ({ signUpCreds, setSignUpCreds }),
    [signUpCreds, setSignUpCreds]
  );

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
    <SignupContext.Provider value={signupValues}>
      {children}
    </SignupContext.Provider>
  );
};

export default SignupProvider;
