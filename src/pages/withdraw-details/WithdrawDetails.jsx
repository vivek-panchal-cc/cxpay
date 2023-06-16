import React, { useCallback, useMemo } from "react";
import SectionTransactionDetails from "./components/SectionTransactionDetails";
import SectionEligibility from "./components/SectionEligibility";
import SectionBankDetails from "./components/SectionBankDetails";
import SectionWithdrawHistory from "./components/SectionWithdrawHistory";
import SectionTransactionReceipt from "./components/SectionTransactionReceipt";
import SectionAdminComments from "./components/SectionAdminComments";
import SectionButtons from "./components/SectionButtons";
import SectionHeader from "./components/SectionHeader";
import { useNavigate, useParams } from "react-router-dom";
import useWithdrawDetails from "hooks/useWithdrawDetails";

const WithdrawDetails = () => {
  const params = useParams();
  const { tid, type } = params || {};
  const navigate = useNavigate();
  const [loading, details] = useWithdrawDetails({
    transaction_id: tid,
    withdrawType: type,
  });
  const {} = useMemo(() => ({ ...details }), [details]);

  const handleBack = () => {
    navigate(`/wallet/withdrawals-${params.tid}`);
  };

  const BankDetails = useCallback(
    () => (
      <>
        {/* Bank and Reciept details section */}
        <div className="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
          <SectionBankDetails />
          <SectionTransactionReceipt />
        </div>
        <div className="wcr-divider-wrap"></div>
        <SectionAdminComments />
      </>
    ),
    []
  );

  const CardDetails = useCallback(
    () => (
      <>
        {/* Card Eligibility and withdraw-History details section */}
        <SectionEligibility />
        <div className="wcr-divider-wrap"></div>
        <SectionWithdrawHistory />
      </>
    ),
    []
  );

  return (
    <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
      <div className="wr-title-wrap">
        <h2>Transection Details</h2>
      </div>
      <div className="wc-refund-main-wrap">
        <div className="pattern-wrap pattern-wrap-top"></div>
        <div className="wc-refund-main-inner">
          <SectionHeader />
          {/* Details Section */}
          <div className="wcr-divider-wrap"></div>
          <SectionTransactionDetails />
          <div className="wcr-divider-wrap"></div>
          {type && type.toLocaleLowerCase() === "bank" ? <BankDetails /> : null}
          {type === "card" ? <CardDetails /> : null}
        </div>
        <div className="pattern-wrap pattern-wrap-bottom"></div>
      </div>
      <SectionButtons handleBack={handleBack} />
    </div>
  );
};

export default WithdrawDetails;
