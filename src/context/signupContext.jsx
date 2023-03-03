import { apiRequest } from "helpers/apiRequests";
import { storageRequest } from "helpers/storageRequests";
import React, { useEffect, useState } from "react";

const initialValues = {
  step: 0,
  mobile_number: "",
  user_otp: "",
  user_type: "",
  mobile_code: "",
  countryList: [],
  cityList: [],
};

export const SignupContext = React.createContext(initialValues);

const SignupProvider = ({ children }) => {
  const creds = storageRequest.getCredsFromtStorage();
  const [signUpCreds, setSignUpCreds] = useState(creds || initialValues);

  useEffect(() => {
    const creds = storageRequest.getCredsFromtStorage();
    if (creds) return setSignUpCreds(creds);
    setSignUpCreds(initialValues);
  }, []);

  useEffect(() => {
    storageRequest.setCredsToStorage(signUpCreds);
  }, [signUpCreds]);

  const getCountries = async () => {
    try {
      const { data } = await apiRequest.getCountry();
      if (!data.success || data.data === null) throw data.message;
      setSignUpCreds((cs) => ({
        ...cs,
        countryList: data?.data?.country_list,
        cityList: data?.data?.city_list,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SignupContext.Provider
      value={{ signUpCreds, setSignUpCreds, getCountries }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export default SignupProvider;
