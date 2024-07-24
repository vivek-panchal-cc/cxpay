import useWithdrawDetails from "hooks/useWithdrawDetails";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

export const WithdrawDetailsContext = React.createContext({});

const WithdrawDetailsProvider = ({ children }) => {
  const params = useParams();
  const { tid, type } = params || {};
  const [loadingDetails, details] = useWithdrawDetails({
    transaction_id: tid,
    withdrawType: type,
  });

  const withdrawDetails = useMemo(
    () => ({
      isLoading: loadingDetails,
      withdrawType: type?.toLowerCase(),
      details: details,
    }),
    [loadingDetails, details, type]
  );

  return (
    <WithdrawDetailsContext.Provider value={withdrawDetails}>
      {children}
    </WithdrawDetailsContext.Provider>
  );
};

export default WithdrawDetailsProvider;
