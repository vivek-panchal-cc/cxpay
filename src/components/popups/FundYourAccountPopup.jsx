import { FUND_CARD, FUND_MANUAL } from "constants/all";
import React from "react";
import { Link } from "react-router-dom";

function FundYourAccountPopup() {
  return (
    <div className="modal-dialog modal-dialog-centered w-100">
      <div className="modal-content">
        <div className="modal-header">
          <img
            src="/assets/images/fund_Card.svg"
            alt=""
            className="ic-shadow"
          />
          <br />
          <h3>Fund Your Account</h3>
        </div>
        <div className="modal-body">
          <div className="fund-payment-option-wrap">
            <Link to={`/wallet/fund-account/${FUND_CARD}`}>
              <div className="fund-payment-option">
                <img src="/assets/images/fund-Wallet.svg" alt="" />
                <p>Credit Card</p>
              </div>
            </Link>
            <Link to={`/wallet/fund-account/${FUND_MANUAL}`}>
              <div className="fund-payment-option">
                <img src="/assets/images/fund_case.svg" alt="" />
                <p>Manual Top up</p>
              </div>
            </Link>
            {/* <Link to={`/wallet/fund-account/${FUND_BANK}`}>
              <div className="fund-payment-option">
                <img src="/assets/images/fund_bt.svg" alt="" />
                <p>Bank Transfer</p>
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundYourAccountPopup;
