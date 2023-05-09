import React from "react";
import { CURRENCY_SYMBOL, activityType } from "constants/all";
import { IconEyeOpen } from "styles/svgs";

const ActivityItem = (props) => {
  const {
    id,
    name,
    date,
    specification,
    type,
    profileImg,
    amount,
    status,
    handleClick,
  } = props || {};

  const profileUrl = profileImg || "/assets/images/single_contact_profile.png";
  const classStatus = activityType?.[type]?.[status]?.classStatus || "";
  const classText = activityType?.[type]?.[status]?.classText || "";
  const textStatus = activityType?.[type]?.[status]?.textStatus || "";
  const iconStatus = activityType?.[type]?.[status]?.iconStatus || "";
  const iconAmount = activityType?.[type]?.[status]?.iconAmount || "";

  return (
    <li onClick={() => handleClick(id)}>
      <div className="act-info-wrap-left">
        <div className="act-user-info-wrap d-flex">
          <div className="act-user-thumb">
            <img src={profileUrl} alt="" />
          </div>
          <div className="act-user-in">
            <h2>{name}</h2>
            <p>{date}</p>
          </div>
        </div>
        <div className="act-specification-text">
          <p>{specification}</p>
        </div>
        <div className="act-amt-status-wrap d-flex">
          <div className="act-status-wrap">
            <button className={`btn ${classStatus}`}>
              {textStatus}
              {iconStatus}
            </button>
          </div>
          <div className={`act-amt-wrap text-end ${classText}`}>
            {iconAmount} {amount} {CURRENCY_SYMBOL}
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

export default ActivityItem;
