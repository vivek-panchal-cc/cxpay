import { storageRequest } from "helpers/storageRequests";
import React, { useEffect, useMemo, useState } from "react";

const initialValues = {  
  kyc_message: "",
  renew_kyc_status: "",
  renew_kyc_attempt_count: "",  
  show_renew_section: "",
  show_renew_button: "",    
};

export const LoginContext = React.createContext(initialValues);

const LoginProvider = ({ children }) => {
  const loginCredsStorage = storageRequest.getLoginCreds();
  const [loginCreds, setLoginCreds] = useState(loginCredsStorage || initialValues);  
  const loginValues = useMemo(
    () => ({ loginCreds, setLoginCreds }),
    [loginCreds, setLoginCreds]
  );

  useEffect(() => {
    const loginCredsStorage = storageRequest.getLoginCreds();
    if (loginCredsStorage) return setLoginCreds(loginCredsStorage);
    setLoginCreds(initialValues);
  }, []);

  useEffect(() => {
    storageRequest.setLoginCredsToStorage(loginCreds);
  }, [loginCreds]);

  return (
    <LoginContext.Provider value={loginValues}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
