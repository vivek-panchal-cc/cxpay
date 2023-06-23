import React, { useContext } from "react";
import Button from "components/ui/Button";
import WrapAmount from "components/wrapper/WrapAmount";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import { useNavigate } from "react-router-dom";

const SectionEligibility = (props) => {
  const navigate = useNavigate();
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const { remaining_amount, transaction_id, is_refundable } = details || {};

  const handleInitiateRefund = (e) => {
    navigate(`/wallet/withdraw-card/${transaction_id}`);
  };

  if (withdrawType && withdrawType === "bank") return null;
  return (
    <div className="wcr-innner-wrap wcr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
      <div className="wcr-eligible-msg">
        <p className="font-16-quick">
          You are eligible to Withdraw{" "}
          <span className="blue">
            <WrapAmount value={remaining_amount} />
          </span>{" "}
          against this Transection
        </p>
      </div>
      <div className="wcr-withdraw-btn">
        {remaining_amount > 0 ? (
          <Button className="btn" onClick={handleInitiateRefund}>
            Withdraw
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default SectionEligibility;
