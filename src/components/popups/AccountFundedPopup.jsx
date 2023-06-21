import WrapAmount from "components/wrapper/WrapAmount";
import React from "react";
import { Link } from "react-router-dom";

function AccountFundedPopup(props) {
  const { fund, balance } = props;

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <img src="/assets/images/fund-success-tick.svg" alt="" />
        </div>
        <div className="modal-body">
          <h3>
            <span className="transfer-amt">
              <WrapAmount value={fund} />
            </span>
            <br />
            Funded to your account
          </h3>
          <p>
            Available balance
            <br />
            <span className="available-bal-acc">
              <WrapAmount value={balance} />
            </span>
          </p>
          <Link
            to="/wallet"
            className="btn btn-primary fund-done-btn"
            replace={true}
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountFundedPopup;
