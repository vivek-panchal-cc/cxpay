import React, { useCallback } from "react";
import Button from "components/ui/Button";
import { CURRENCY_SYMBOL, THEME_COLORS, withdrawConsts } from "constants/all";
import { IconBank } from "styles/svgs";
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

  const {
    classText = "",
    classStatus = "",
    iconAmount = "",
  } = withdrawConsts?.[status] || {};
  const navigate = useNavigate();

  const handleCancelWithdrawRequest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCancel(transaction_id);
  };

  const handleViewDetails = (e) => {
    navigate(`/wallet/withdraw-details/bank/${transaction_id}`);
  };

  const showCancelRequestButton = useCallback(
    ({ className }) =>
      status === "PENDING" ? (
        <Button className={className} onClick={handleCancelWithdrawRequest}>
          Cancel Request
        </Button>
      ) : null,
    []
  );

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
          <div className={`total-val-wrap`}>
            <WrapAmount
              className={classText}
              value={amount}
              prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
            />
          </div>
          <div className="status-wrap">
            <Button className={`btn ${classStatus}`}>{status}</Button>
            {showCancelRequestButton({
              className: "wr-bank-cancel-req d-none d-md-block ms-auto",
            })}
          </div>
        </div>
        {showCancelRequestButton({
          className: "wr-bank-cancel-req ms-auto d-block d-md-none",
        })}
      </div>
    </li>
  );
};

export default WithdrawBankItem;
