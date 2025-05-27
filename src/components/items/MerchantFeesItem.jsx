import React from "react";
import { CURRENCY_SYMBOL } from "constants/all";
import { IconEyeOpen } from "styles/svgs";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDate } from "helpers/commonHelpers";
import { getInitials, getRandomColorClass } from "constants/all";

const MerchantFeesItem = (props) => {
  const { reportDetails, handleClick } = props || {};
  const { sname, ref_id, amount, narration, profile_image, created_at } =
    reportDetails || {};

  const altAmount =
    typeof amount === "number" || "string" ? parseFloat(amount) : "";

  return (
    <li onClick={() => handleClick(reportDetails)}>
      <div className="act-info-wrap-left">
        <div className="act-user-info-wrap d-flex">
          <div className="act-user-thumb">
            {profile_image ? (
              <img src={profile_image} className="blue-bg" alt="" />
            ) : (
              <div
                className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                  sname
                )}`}
              >
                {getInitials(sname)}
              </div>
            )}
          </div>
          <div className="act-user-in">
            <h2>{sname}</h2>
            <p>{formatDate(created_at)}</p>
          </div>
        </div>
        <div className="act-specification-text">
          <p>{ref_id}</p>
        </div>
        <div className="act-amt-status-wrap d-flex">
          <div className="act-specification-text">
            <p>{narration}</p>
          </div>
          <div className={`act-amt-wrap text-end`}>
            <WrapAmount value={altAmount} prefix={`${CURRENCY_SYMBOL} `} />
          </div>
        </div>
      </div>
      <div className="act-mv-wrap">
        <div className="act-edit-btn">
          <button>
            <IconEyeOpen />
          </button>
        </div>
      </div>
    </li>
  );
};

export default MerchantFeesItem;
