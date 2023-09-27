import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";

const PaymentUserItem = (props) => {
  const { name, profileImg, amount, groupAmount } = props;
  return (
    <li>
      <div className="sp-user-wrap">
        <div className="sp-user-wrap-thumb">
          <img src={profileImg} alt="" />
        </div>
        <div className="sp-user-nm">{name}</div>
      </div>
      {amount ? (
        <div className="sp-amt">
          <WrapAmount value={amount} />
        </div>
      ) : (
        <div className="sp-amt">
          <WrapAmount value={groupAmount} />
        </div>
      )}
    </li>
  );
};

export default PaymentUserItem;
