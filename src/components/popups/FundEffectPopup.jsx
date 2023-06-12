import { CURRENCY_SYMBOL } from "constants/all";
import React from "react";
import { Link } from "react-router-dom";

const FundEffectPopup = (props) => {
  const {
    imgUrl = "/assets/images/fund-success-tick.svg",
    fund = "",
    fundMessage = "",
    redirectText = "Done",
    redirect = "/",
  } = props;

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <img src={imgUrl} alt="" />
        </div>
        <div className="modal-body text-center">
          <h3>
            <span className="transfer-amt">
              {CURRENCY_SYMBOL} {fund}
            </span>
          </h3>
          <h3>{fundMessage}</h3>
          <Link
            to={redirect}
            className="btn btn-primary fund-done-btn mt-4"
            replace={true}
          >
            {redirectText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FundEffectPopup;
