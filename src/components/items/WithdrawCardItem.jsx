import React, { useMemo } from "react";
import Button from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  IconArrowReturn,
  IconCardBackground,
  IconCreditCard,
  IconEye,
} from "styles/svgs";

const WithdrawCardItem = (props) => {
  const { className = "" } = props;
  const image = "";
  const color = "#0000ff80";
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
    return <IconCreditCard height="inherit" />;
  }, []);

  const handleInitiateRefund = () => {
    navigate(`/wallet/withdraw-card/${"id"}`);
  };

  const handleViewDetails = () => {
    navigate(`/wallet/withdraw-details/${"id"}`);
  };

  return (
    <li className={`${className}`}>
      <div className="rcard-img-wrap">{CardIcon}</div>
      <div className="rcard-details-wrap">
        <div className="card-details">
          <div className="rcard-info">
            <h3>xxxx xxxx xxxx 1234</h3>
            <p>24/05/2023 | 03:20 PM</p>
          </div>
          <div className="eligible-value-wrap">
            Eligible : <span>200</span> ANG
          </div>
        </div>
        <div className="rcard-status-wrap">
          <div className="total-val-wrap">
            + <span>500</span> ANG
          </div>
          <div className="status-wrap">
            <Button className="btn btn-green">Status</Button>
          </div>
        </div>
        <div className="btns-wrap">
          <Button className="refresh-ic" onClick={handleInitiateRefund}>
            <IconArrowReturn fill="#fff" />
          </Button>
          <Button className="view-ic" onClick={handleViewDetails}>
            <IconEye stroke="#fff" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default WithdrawCardItem;
