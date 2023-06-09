import Button from "components/ui/Button";
import React from "react";
import { Link } from "react-router-dom";

const SectionEligibility = () => {
  return (
    <div class="wcr-innner-wrap wcr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
      <div class="wcr-eligible-msg">
        <p class="font-16-quick">
          You are eligible to Withdraw <span class="blue">200.00 NAFl</span>{" "}
          against this Transection
        </p>
      </div>
      <div class="wcr-withdraw-btn">
        <Button class="btn">Withdraw</Button>
      </div>
    </div>
  );
};

export default SectionEligibility;
