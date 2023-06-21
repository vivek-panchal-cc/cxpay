import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";

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
        <WrapAmount value={amount} />
      </div>
    </li>
  );
};

export default PaymentUserItem;
