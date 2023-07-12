import React from "react";
import Button from "components/ui/Button";
import { CURRENCY_SYMBOL, THEME_COLORS } from "constants/all";
import { IconBank, IconEye } from "styles/svgs";
import { useNavigate } from "react-router-dom";
import WrapAmount from "components/wrapper/WrapAmount";

const WithdrawBankItem = (props) => {
  const { className = "", itemDetails, handleCancel = () => {} } = props;
  const {
    transaction_id,
    amount,
    status,
    date,
    bank_account_number,
    bank_name,
  } = itemDetails || {};

  const navigate = useNavigate();

  const handleCancelWithdrawRequest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel(transaction_id);
  };

  const handleViewDetails = (e) => {
    navigate(`/wallet/withdraw-details/bank/${transaction_id}`);
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
            <h3>{bank_name}</h3>
          </div>
          <div className="wrb-date-wrap">
            <p>{date}</p>
          </div>
        </div>
        <div className="rcard-status-wrap">
          <div className="total-val-wrap">
            <WrapAmount value={amount} prefix={`${CURRENCY_SYMBOL} +`} />
          </div>
          <div className="status-wrap">
            <Button className="btn btn-green">{status}</Button>
            {status !== "CANCELLED" ? (
              <Button
                className="wr-bank-cancel-req d-none d-md-block ms-auto"
                onClick={handleCancelWithdrawRequest}
              >
                Cancel Request
              </Button>
            ) : null}
          </div>
        </div>
        {status !== "CANCELLED" ? (
          <Button
            className="wr-bank-cancel-req ms-auto d-block d-md-none"
            onClick={handleCancelWithdrawRequest}
          >
            Cancel Request
          </Button>
        ) : null}
      </div>
    </li>
  );
};

export default WithdrawBankItem;
