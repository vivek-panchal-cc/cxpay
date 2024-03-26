import useSystemOptions from "hooks/useSystemOptions";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { LoaderContext } from "./loaderContext";

export const SystemOptionsContext = createContext({
  TRANSACTION_LIMIT_PERSONAL: "",
  TRANSACTION_LIMIT_BUSINESS: "",
  ADD_FUND_LIMIT: "",
  WITHDRAW_LIMIT: "",
  BANK_NAME: "",
  BANK_ACCOUNT_NUMBER: "",
  SWIFT_CODE: "",
  SUPPORT_EMAIL: "",
  MANUAL_KYC: "",
});

const SystemOptionsProvider = ({ children }) => {
  const { setIsLoading } = useContext(LoaderContext);

  const [opLoading, options] = useSystemOptions();
  const systemOptions = useMemo(() => options || {}, [options]);

  useEffect(() => {
    if (opLoading) {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);
  }, [opLoading]);

  return (
    <SystemOptionsContext.Provider value={systemOptions}>
      {children}
    </SystemOptionsContext.Provider>
  );
};

export default SystemOptionsProvider;
