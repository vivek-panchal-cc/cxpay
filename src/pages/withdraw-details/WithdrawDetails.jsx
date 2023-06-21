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
  const {
    transaction_id = "",
    date = "",
    time = "",
    card_number = "",
    amount = "",
    fees = "",
    total_amount = "",
    status = "",
    card_expiry_date = "",
    remaining_amount = "",
    withdraw_details = [],
    // amount,
    // fees,
    // date,
    // status,
    // transaction_id,
    // total_amount,
    customer_account_number = "",
    activity_ref_id = "",
    bank_account_number = "",
    bank_name = "",
    swift_code = "",
    comment = "",
    request_receive_date = "",
    id = "",
    narration = "",
    specification = "",
    receipt_images = [],
  } = useMemo(() => ({ ...details }), [details]);

  const handleBack = () => {
    navigate(`/wallet/withdrawals-${type}`);
  };

  const BankDetails = useCallback(
    () => (
      <>
        {/* Bank and Reciept details section */}
        <div className="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
          <SectionBankDetails
            {...{ bank_account_number, bank_name, swift_code }}
          />
          <SectionTransactionReceipt {...{ receipt_images }} />
        </div>
        <div className="wcr-divider-wrap"></div>
        <SectionAdminComments />
      </>
    ),
    [bank_account_number, bank_name, swift_code, receipt_images]
  );

  const CardDetails = useCallback(
    () => (
      <>
        {/* Card Eligibility and withdraw-History details section */}
        <SectionEligibility {...{ remaining_amount, transaction_id }} />
        <div className="wcr-divider-wrap"></div>
        <SectionWithdrawHistory {...{ withdraw_details }} />
      </>
    ),
    [remaining_amount, withdraw_details, transaction_id]
  );

  return (
    <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
      <div className="wr-title-wrap">
        <h2>Transection Details</h2>
      </div>
      <div className="wc-refund-main-wrap">
        <div className="pattern-wrap pattern-wrap-top"></div>
        <div className="wc-refund-main-inner">
          {type && type.toLowerCase() === "card" ? (
            <SectionHeader
              name={card_number}
              accountNumber={card_number}
              amount={amount}
              status={status}
              specification={specification}
            />
          ) : null}
          {type && type.toLowerCase() === "bank" ? (
            <SectionHeader
              name={bank_name}
              accountNumber={bank_account_number}
              amount={amount}
              status={status}
              specification={specification}
            />
          ) : null}
          {/* Details Section */}
          <div className="wcr-divider-wrap"></div>
          <SectionTransactionDetails
            {...{
              transaction_id,
              date,
              time,
              total_amount,
              fees,
              status,
            }}
          />
          <div className="wcr-divider-wrap"></div>
          {type && type.toLowerCase() === "bank" ? <BankDetails /> : null}
          {type && type.toLowerCase() === "card" ? <CardDetails /> : null}
        </div>
        <div className="pattern-wrap pattern-wrap-bottom"></div>
      </div>
      <SectionButtons handleBack={handleBack} />
    </div>
  );
};

export default WithdrawDetails;
