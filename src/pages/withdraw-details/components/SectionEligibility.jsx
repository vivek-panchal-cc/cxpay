import React from "react";
import { Link } from "react-router-dom";

const SectionEligibility = () => {
  return (
    <div>
      <p>You are eligible to withdraw 200.00 ANG against this Transaction</p>
      <Link className="btn p-2">Withdraw</Link>
    </div>
  );
};

export default SectionEligibility;
