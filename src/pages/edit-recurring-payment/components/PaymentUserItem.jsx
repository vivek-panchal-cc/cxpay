import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import { IconDeleteContact } from "styles/svgs";

const PaymentUserItem = (props) => {
  const { name, profileImg, amount, groupAmount, isDeleted = false } = props;
  return (
    <li>
      <div className="sp-user-wrap">
        <div className="sp-user-wrap-thumb">
          <img src={profileImg} alt="" />
        </div>
        <div className="sp-user-nm">
          {name}{" "}
          {isDeleted && (
            <span className="tooltip-container-contact">
              <IconDeleteContact />
              <div
                style={{ fontSize: "12px", fontWeight: "normal" }}
                className="tooltip-contact"
              >
                Contact is deleted
              </div>
            </span>
          )}
        </div>
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
