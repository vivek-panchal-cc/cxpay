import WrapAmount from "components/wrapper/WrapAmount";
import React from "react";
import { IconBank } from "styles/svgs";

const SectionHeader = (props) => {
  const {
    name = "",
    accountNumber = "",
    amount = "",
    status = "",
    specification = "",
  } = props || {};

  return (
    <>
      <div className="wcr-innner-wrap wcr-innner-wrap-1 d-flex flex-wrap w-100">
        <div className="wcr-img-wrap wbr-img-wrap">
          <span bg-color="#000">
            <IconBank stroke="#363853" />
          </span>
        </div>
        <div className="wcr-info-main">
          <div className="wcr-info-1 d-flex flex-wrap">
            <div className="wcr-card-data">
              <h2>{name}</h2>
              <p>
                xxxx xxxx xxxx{" "}
                {accountNumber
                  ? accountNumber?.substr(accountNumber.length - 4)
                  : "XXXX"}
              </p>
            </div>
            <div className="wcr-card-amt wbr-card-amt">
              <p className="green font-bold">{status}</p>
              <h2>
                <WrapAmount value={amount} />
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="wcr-info-2">
        <h4 className="font-16-quick">Specifications</h4>
        <p>{specification}</p>
      </div>
    </>
  );
};

export default SectionHeader;
