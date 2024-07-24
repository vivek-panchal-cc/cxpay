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
import WithdrawDetailsProvider from "context/withdrawDetailsContext";

const WithdrawDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tid, type } = params || {};

  const handleBack = () => {
    navigate(`/wallet/withdrawals-${type}`);
  };

  return (
    <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
      <WithdrawDetailsProvider>
        <div className="wr-title-wrap">
          <h2>Transaction Details</h2>
        </div>
        <div className="wc-refund-main-wrap">
          <div className="pattern-wrap pattern-wrap-top"></div>
          <div className="wc-refund-main-inner">
            <SectionHeader />
            {/* Details Section */}
            <div className="wcr-divider-wrap"></div>
            <SectionTransactionDetails />
            <div className="wcr-divider-wrap"></div>
            {/* Card Eligibility and withdraw-History details section */}
            <>
              <SectionEligibility />
              <SectionWithdrawHistory />
            </>
            {/* Bank and Reciept details section */}
            <>
              <div className="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                <SectionBankDetails />
                <SectionTransactionReceipt />
              </div>
              <div className="wcr-divider-wrap"></div>
              <SectionAdminComments />
            </>
          </div>
          <div className="pattern-wrap pattern-wrap-bottom"></div>
        </div>
        <SectionButtons handleBack={handleBack} />
      </WithdrawDetailsProvider>
    </div>
  );
};

export default WithdrawDetails;
