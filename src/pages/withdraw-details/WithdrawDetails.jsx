import React from "react";
import SectionTransactionDetails from "./components/SectionTransactionDetails";
import SectionEligibility from "./components/SectionEligibility";
import SectionBankDetails from "./components/SectionBankDetails";
import SectionWithdrawHistory from "./components/SectionWithdrawHistory";
import SectionTransactionReceipt from "./components/SectionTransactionReceipt";
import SectionAdminComments from "./components/SectionAdminComments";
import SectionButtons from "./components/SectionButtons";
import SectionHeader from "./components/SectionHeader";
import { useNavigate, useParams } from "react-router-dom";

const WithdrawDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/wallet/withdrawals-${params.tid}`);
  };

  return (
    <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
      <div class="wr-title-wrap">
        <h2>Transection Details</h2>
      </div>
      <div class="wc-refund-main-wrap">
        <div class="pattern-wrap pattern-wrap-top"></div>
        <div class="wc-refund-main-inner">
          <SectionHeader />
          {/* Details Section */}
          <div class="wcr-divider-wrap"></div>
          <SectionTransactionDetails />
          <div class="wcr-divider-wrap"></div>
          {params.tid === "bank" ? (
            <>
              {/* Bank and Reciept details section */}
              <div class="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                <SectionBankDetails />
                <SectionTransactionReceipt />
              </div>
              <div class="wcr-divider-wrap"></div>
              <SectionAdminComments />
            </>
          ) : null}
          {params.tid === "card" ? (
            <>
              {/* Card Eligibility and withdraw-History details section */}
              <SectionEligibility />
              <div class="wcr-divider-wrap"></div>
              <SectionWithdrawHistory />
            </>
          ) : null}
        </div>
        <div class="pattern-wrap pattern-wrap-bottom"></div>
      </div>
      <SectionButtons handleBack={handleBack} />
    </div>
  );
};

export default WithdrawDetails;
