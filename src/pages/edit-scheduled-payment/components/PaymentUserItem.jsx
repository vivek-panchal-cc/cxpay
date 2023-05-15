import { CURRENCY_SYMBOL } from "constants/all";
import React from "react";

const PaymentUserItem = (props) => {
  const { name, profileImg, amount } = props;
  return (
    <li>
      <div class="sp-user-wrap">
        <div class="sp-user-wrap-thumb">
          <img src={profileImg} alt="" />
        </div>
        <div class="sp-user-nm">{name}</div>
      </div>
      <div class="sp-amt">
        {CURRENCY_SYMBOL} {amount}
      </div>
    </li>
  );
};

export default PaymentUserItem;
