import React from "react";
import Button from "components/ui/Button";
import { THEME_COLORS } from "constants/all";
import { IconBank, IconEye } from "styles/svgs";
import { useNavigate } from "react-router-dom";

const WithdrawBankItem = (props) => {
  const { className = "" } = props;
  const navigate = useNavigate();

  const handleCancelWithdrawRequest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/wallet`);
  };

  const handleViewDetails = (e) => {
    navigate(`/wallet/withdraw-details/${"bank"}`);
  };

  return (
    <li className={className} onClick={handleViewDetails}>
      <div className="rcard-img-wrap">
        <div
          className="bank-logo-wrap wr-bank-svg"
          bg-color={THEME_COLORS[0 % THEME_COLORS.length]}
        >
          <IconBank />
        </div>
      </div>
      <div className="rcard-details-wrap">
        <div className="card-details">
          <div className="rcard-info">
            <h3>xxxx xxxx xxxx 1234</h3>
          </div>
          <div className="wrb-date-wrap">
            <p>24/05/2023 | 03:20 PM</p>
          </div>
        </div>
        <div className="rcard-status-wrap">
          <div className="total-val-wrap">
            + <span>500</span> ANG
          </div>
          <div className="status-wrap">
            <Button className="btn btn-green">Accepted</Button>
            <Button
              className="wr-bank-cancel-req d-none d-md-block ms-auto"
              onClick={handleCancelWithdrawRequest}
            >
              Cancel Request
            </Button>
          </div>
        </div>
        <Button
          className="wr-bank-cancel-req ms-auto d-block d-md-none"
          onClick={handleCancelWithdrawRequest}
        >
          Cancel Request
        </Button>
      </div>
    </li>
  );
};

export default WithdrawBankItem;
