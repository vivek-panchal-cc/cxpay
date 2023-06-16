import React, { useMemo } from "react";
import Button from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { IconCardBackground, IconCreditCard } from "styles/svgs";
import { CURRENCY_SYMBOL } from "constants/all";

const WithdrawCardItem = (props) => {
  const { className = "", itemDetails } = props;
  const {
    amount,
    date,
    image,
    color,
    remaining_amount,
    status,
    transaction_id,
  } = itemDetails || {};
  const navigate = useNavigate();

  const [dt, tmm] = date ? date.split(" ") : [];
  const [dd, mm, yyyy] = dt ? dt.split("/") : [];
  const fundDate = dt && tmm ? new Date(`${mm}/${dd}/${yyyy} ${tmm}`) : "";

  const CardIcon = useMemo(() => {
    if (image) return <img src={image} alt="" className="rounded" />;
    else if (color)
      return (
        <IconCardBackground
          className="bank-card-wrap rounded h-100 w-100"
          style={{ background: color }}
        />
      );
    return <IconCreditCard height="inherit" />;
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
            <h3>xxxx xxxx xxxx 1234</h3>
            <p>
              {fundDate
                ? `${fundDate?.toLocaleDateString(
                    "en-UK"
                  )} | ${fundDate?.toLocaleTimeString()}`
                : ""}
              {/* 24/05/2023 | 03:20 PM */}
            </p>
          </div>
          <div className="eligible-value-wrap">
            Eligible : <span>{remaining_amount}</span> {CURRENCY_SYMBOL}
          </div>
        </div>
        <div className="rcard-status-wrap">
          <div className="total-val-wrap">
            + <span>{amount}</span> {CURRENCY_SYMBOL}
          </div>
          <div className="status-wrap">
            <Button className="btn btn-green">Status</Button>
          </div>
        </div>
        <div className="btns-wrap">
          <Button
            className={`wr-withdraw-btn ${
              status !== "Active" ? "opacity-50" : "opacity-100"
            }`}
            onClick={status === "Active" ? handleInitiateRefund : () => {}}
            disabled={status !== "Active"}
          >
            withdraw
          </Button>
        </div>
      </div>
    </li>
  );
};

export default WithdrawCardItem;
