import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import FundBankTransfer from "./components/FundBankTransfer";
import FundCashCredit from "./components/FundCashCredit";
import FundCreditCard from "./components/FundCreditCard";

function FundAccount(props) {
  const params = useParams();

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

  return <div>{getSelectedFund()}</div>;
}

export default FundAccount;
