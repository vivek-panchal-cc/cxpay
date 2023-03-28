import FundProvider from "context/fundContext";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      case "card":
        return <FundCreditCard />;
      case "cash":
        return <FundCashCredit />;
      case "bank":
        return <FundBankTransfer />;
      default:
        <></>;
    }
  };

  return (
    <div>
      <FundProvider>{getSelectedFund()}</FundProvider>
    </div>
  );
}

export default FundAccount;