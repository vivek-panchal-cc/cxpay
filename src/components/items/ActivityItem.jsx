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

  return (
    <li onClick={() => handleClick(id)}>
      <div class="act-info-wrap-left">
        <div class="act-user-info-wrap d-flex">
          <div class="act-user-thumb">
            <img src={profileUrl} alt="" />
          </div>
          <div class="act-user-in">
            <h2>{name}</h2>
            <p>{date}</p>
          </div>
        </div>
        <div class="act-specification-text">
          <p>{specification}</p>
        </div>
        <div class="act-amt-status-wrap d-flex">
          <div class="act-status-wrap">
            <button
              class={`btn ${activityType?.[type]?.[status]?.classStatus}`}
            >
              {activityType?.[type]?.[status]?.textStatus}
              {activityType?.[type]?.[status]?.iconStatus}
            </button>
          </div>
          <div
            class={`act-amt-wrap ${activityType?.[type]?.[status]?.classAmount}`}
          >
            {activityType?.[type]?.[status]?.iconAmount} {amount}{" "}
            {CURRENCY_SYMBOL}
          </div>
        </div>
      </div>
      <div class="act-mv-wrap">
        <div class="act-edit-btn">
          <button>
            <IconEyeOpen />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;
