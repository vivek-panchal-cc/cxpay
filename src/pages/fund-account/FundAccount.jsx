import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FUND_CARD } from "constants/all";
import FundProvider from "context/fundContext";
import FundCreditCard from "./components/FundCreditCard";

function FundAccount(props) {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params?.fundtype) navigate("/wallet");
  }, [params]);

  const getSelectedFund = () => {
    if (!params?.fundtype) return <></>;
    switch (params.fundtype) {
      case FUND_CARD:
        return <FundCreditCard />;
      // case FUND_CASH:
      //   return <FundCashCredit />;
      // case FUND_BANK:
      //   return <FundBankTransfer />;
      default:
        return <Navigate to="/wallet" replace={true} />;
    }
  };

  return (
    <div>
      <FundProvider>{getSelectedFund()}</FundProvider>
    </div>
  );
}

export default FundAccount;
