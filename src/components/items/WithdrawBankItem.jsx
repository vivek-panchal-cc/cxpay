import { THEME_COLORS } from "constants/all";
import React from "react";
import { Link } from "react-router-dom";
import { IconActReqReceive, IconBank, IconEyeOpen } from "styles/svgs";

const WithdrawBankItem = () => {
  return (
    <div className="mb-4">
      <div className="row">
        <div className="col-2">
          <div
            className="bank-logo-wrap"
            bg-color={THEME_COLORS[0 % THEME_COLORS.length]}
          >
            <IconBank />
          </div>
        </div>
        <div className="col-4">
          <div className="d-flex flex-column">
            <p className="mb-0">Bank Name</p>
            <p className="mb-0">06 Jun 2023 9:30 AM</p>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex justify-content-between">
            <p className="mb-0">Pending</p>
            <p className="mb-0">500 ANG</p>
            <Link to={`/wallet/withdraw-bank/${1}`}>
              <IconActReqReceive />
            </Link>
            <Link to={`/wallet/withdraw-details/${1}`}>
              <IconEyeOpen />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawBankItem;
