import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import { IconDeleteContact } from "styles/svgs";
import { getInitials, getRandomColorClass } from "constants/all";

const PaymentUserItem = (props) => {
  const { name, profileImg, amount, isDeleted = false } = props;
  return (
    <li>
      <div className="sp-user-wrap">
        <div className="sp-user-wrap-thumb">
          {/* <img src={profileImg} alt="" /> */}
          {profileImg ? (
            <img src={profileImg} className="blue-bg" alt="" />
          ) : (
            <div
              className={`pt-1 p-0 initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                name
              )}`}
            >
              {getInitials(name)}
            </div>
          )}
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
      <div className="act-amt-wrap sp-amt cx-color-green">
        <WrapAmount value={amount} />
      </div>
    </li>
  );
};

export default PaymentUserItem;
