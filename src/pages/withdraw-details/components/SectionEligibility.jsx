import Button from "components/ui/Button";
import React from "react";
import { Link } from "react-router-dom";

const SectionEligibility = () => {
  return (
    <div className="wcr-innner-wrap wcr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
      <div className="wcr-eligible-msg">
        <p className="font-16-quick">
          You are eligible to Withdraw <span className="blue">200.00 NAFl</span>{" "}
          against this Transection
        </p>
      </div>
      <div className="wcr-withdraw-btn">
        <Button className="btn">Withdraw</Button>
      </div>
    </div>
  );
};

export default SectionEligibility;
