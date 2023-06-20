import Button from "components/ui/Button";
import { CURRENCY_SYMBOL } from "constants/all";
import React from "react";

const SectionEligibility = (props) => {
  const { remaining_amount } = props;

  return (
    <div className="wcr-innner-wrap wcr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
      <div className="wcr-eligible-msg">
        <p className="font-16-quick">
          You are eligible to Withdraw{" "}
          <span className="blue">
            {remaining_amount} {CURRENCY_SYMBOL}
          </span>{" "}
          against this Transection
        </p>
      </div>
      <div className="wcr-withdraw-btn">
        {remaining_amount > 0 ? (
          <Button className="btn">Withdraw</Button>
        ) : null}
      </div>
    </div>
  );
};

export default SectionEligibility;
