import React from "react";
import { Link } from "react-router-dom";
import { IconActReqReceive, IconEyeOpen } from "styles/svgs";

const WithdrawCardItem = () => {
  return (
    <div className="my-2">
      <div className="row">
        <div className="col-2">
          <img
            src="/assets/images/card-5.png"
            alt=""
            style={{
              height: "50px",
            }}
          />
        </div>
        <div className="col-4">
          <div className="d-flex flex-column">
            <p className="mb-0">XXXX XXXX XXXX 1111</p>
            <p className="mb-0">06 Jun 2023</p>
            <small>Id: ZCWKCWERVO123</small>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex justify-content-between">
            <p className="mb-0">+500 ANG</p>
            <p className="mb-0">200 ANG</p>
            <Link to={`/wallet/withdraw-card/${1}`}>
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

export default WithdrawCardItem;
