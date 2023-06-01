import { CURRENCY_SYMBOL } from "constants/all";
import React from "react";

const PaymentUserItem = (props) => {
  const { name, profileImg, amount } = props;
  return (
    <li>
      <div className="sp-user-wrap">
        <div className="sp-user-wrap-thumb">
          <img src={profileImg} alt="" />
        </div>
        <div className="sp-user-nm">{name}</div>
      </div>
      <div className="sp-amt">
        {CURRENCY_SYMBOL} {typeof amount === "number" ? amount?.toFixed(2) : ""}
      </div>
    </li>
  );
};

export default PaymentUserItem;
