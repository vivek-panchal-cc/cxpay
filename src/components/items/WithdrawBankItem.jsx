import React from "react";
import Button from "components/ui/Button";
import { THEME_COLORS } from "constants/all";
import { IconBank } from "styles/svgs";

const WithdrawBankItem = () => {
  return (
    <li>
      <div className="rcard-img-wrap">
        <div
          className="bank-logo-wrap"
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
          </div>
        </div>
      </div>
    </li>
  );
};

export default WithdrawBankItem;
