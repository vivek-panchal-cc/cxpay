import Modal from "components/modals/Modal";
import AccountFundedPopup from "components/popups/AccountFundedPopup";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import FundBankTransfer from "./components/FundBankTransfer";
import FundCashCredit from "./components/FundCashCredit";
import FundCreditCard from "./components/FundCreditCard";

function FundAccount(props) {
  const params = useParams();
  const [visiblePopupFunded, setVisiblePopupFunded] = useState(false);
  const [fund, setFund] = useState(0);

  const showPopupFunded = (fund) => {
    setVisiblePopupFunded(true);
    setFund(fund);
  };

  const getSelectedFund = () => {
    if (!(params && params.fundtype)) return <></>;
    switch (params.fundtype) {
      case "card":
        return <FundCreditCard showPopupFunded={showPopupFunded} />;
      case "cash":
        return <FundCashCredit showPopupFunded={showPopupFunded} />;
      case "bank":
        return <FundBankTransfer showPopupFunded={showPopupFunded} />;
      default:
        <></>;
    }
  };

  return (
    <div>
      <Modal
        id="fund_sucess_modal"
        className="fund-sucess-modal"
        show={visiblePopupFunded}
        setShow={setVisiblePopupFunded}
      >
        <AccountFundedPopup fund={fund} balance={0} />
      </Modal>
      {getSelectedFund()}
    </div>
  );
}

export default FundAccount;
