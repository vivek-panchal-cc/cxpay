import React from "react";
import SectionTransactionDetails from "./components/SectionTransactionDetails";
import SectionEligibility from "./components/SectionEligibility";
import SectionBankDetails from "./components/SectionBankDetails";
import SectionWithdrawHistory from "./components/SectionWithdrawHistory";
import SectionTransactionReceipt from "./components/SectionTransactionReceipt";
import SectionAdminComments from "./components/SectionAdminComments";
import SectionButtons from "./components/SectionButtons";

const WithdrawDetails = () => {
  return (
    <div className="w-75 shadow p-4">
      <h4 className="fs-4">Transaction Details</h4>
      <SectionTransactionDetails />
      <SectionBankDetails />
      <SectionEligibility />
      <SectionWithdrawHistory />
      <SectionTransactionReceipt />
      <SectionAdminComments />
      <SectionButtons />
    </div>
  );
};

export default WithdrawDetails;
