import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FUND_BANK, FUND_CARD, FUND_CASH } from "constants/all";
import FundProvider from "context/fundContext";
import FundBankTransfer from "./components/FundBankTransfer";
import FundCashCredit from "./components/FundCashCredit";
import FundCreditCard from "./components/FundCreditCard";

function FundAccount(props) {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params || !params.fundtype) navigate("/wallet");
  }, [params]);

  const getSelectedFund = () => {
    if (!(params && params.fundtype)) return <></>;
    switch (params.fundtype) {
      case FUND_CARD:
        return <FundCreditCard />;
      // case FUND_CASH:
      //   return <FundCashCredit />;
      // case FUND_BANK:
      //   return <FundBankTransfer />;
      default:
        return <></>;
    }
  };

  return (
    <div>
      <FundProvider>{getSelectedFund()}</FundProvider>
    </div>
  );
}

export default FundAccount;
