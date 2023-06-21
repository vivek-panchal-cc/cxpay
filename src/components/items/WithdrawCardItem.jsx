import React, { useMemo } from "react";
import Button from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { IconCardBackground, IconCreditCard } from "styles/svgs";
import { CURRENCY_SYMBOL, WITHDRAW_STATUS_FILTER_CARD } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";

const WithdrawCardItem = (props) => {
  const { className = "", itemDetails } = props;
  const {
    card_number,
    amount,
    is_refundable,
    date,
    image,
    color,
    remaining_amount,
    status,
    transaction_id,
  } = itemDetails || {};
  const navigate = useNavigate();

  const CardIcon = useMemo(() => {
    if (image) return <img src={image} alt="" className="rounded" />;
    else if (color)
      return (
        <IconCardBackground
          className="bank-card-wrap rounded h-100 w-100"
          style={{ background: color }}
        />
      );
    return <IconCreditCard height="100%" />;
  }, []);

  const handleInitiateRefund = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/wallet/withdraw-card/${transaction_id}`);
  };

  const handleViewDetails = (e) => {
    navigate(`/wallet/withdraw-details/card/${transaction_id}`);
  };

  return (
    <li className={`${className}`} onClick={handleViewDetails}>
      <div className="rcard-img-wrap">{CardIcon}</div>
      <div className="rcard-details-wrap">
        <div className="card-details">
          <div className="rcard-info">
            <h3>xxxx xxxx xxxx {card_number}</h3>
            <p>
              {date}
              {/* 24/05/2023 | 03:20 PM */}
            </p>
          </div>
          <div className="eligible-value-wrap">
            Eligible : <WrapAmount value={remaining_amount} />
          </div>
        </div>
        <div className="rcard-status-wrap">
          <div className="total-val-wrap">
            <WrapAmount value={amount} prefix={`${CURRENCY_SYMBOL} +`} />
          </div>
          <div className="status-wrap">
            <Button
              className={`btn ${is_refundable ? "btn-green" : "btn-red"}`}
            >
              {is_refundable
                ? WITHDRAW_STATUS_FILTER_CARD[0].title
                : WITHDRAW_STATUS_FILTER_CARD[1].title}
            </Button>
          </div>
        </div>
        <div className="btns-wrap">
          <Button
            className={`wr-withdraw-btn ${
              is_refundable ? "opacity-100" : "opacity-50"
            }`}
            onClick={is_refundable ? handleInitiateRefund : () => {}}
            disabled={!is_refundable}
          >
            withdraw
          </Button>
        </div>
      </div>
    </li>
  );
};

export default WithdrawCardItem;
