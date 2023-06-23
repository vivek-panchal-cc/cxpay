import useWithdrawDetails from "hooks/useWithdrawDetails";
import React from "react";
import { useParams } from "react-router-dom";

export const WithdrawDetailsContext = React.createContext({});

const WithdrawDetailsProvider = ({ children }) => {
  const params = useParams();
  const { tid, type } = params || {};
  const [loadingDetails, details] = useWithdrawDetails({
    transaction_id: tid,
    withdrawType: type,
  });

  return (
    <WithdrawDetailsContext.Provider
      value={{
        isLoading: loadingDetails,
        withdrawType: type?.toLowerCase(),
        details: details,
      }}
    >
      {children}
    </WithdrawDetailsContext.Provider>
  );
};

export default WithdrawDetailsProvider;
