import React, { useMemo } from "react";
import {
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import { IconEyeOpen } from "styles/svgs";

const ActivityItem = (props) => {
  const { activityDetails, handleClick } = props || {};
  const {
    id,
    account_number,
    specification,
    amount,
    status,
    name,
    request_type,
    user_type,
    activity_type,
    reference_id,
    date,
    profile_image,
  } = activityDetails || {};

  const profileUrl =
    profile_image || "/assets/images/single_contact_profile.png";
  const altAmount = amount ? parseFloat(amount).toFixed(2) : "";
  const description = useMemo(() => {
    const { desc } =
      activityConsts?.[activity_type]?.[request_type]?.[status] || {};
    if (!desc) return "";
    const aDesc = desc?.replace(/XXXX/g, altAmount).replace(/YYYY/, name);
    return aDesc;
  }, []);

  const {
    iconStatus = "",
    iconAmount = "",
    classStatus = "",
    classBg = "",
    classText = "",
    textStatus = "",
  } = useMemo(() => {
    if (!activity_type) return {};
    switch (activity_type) {
      case ACT_TYPE_REQUEST:
        return activityConsts[activity_type]?.[request_type]?.[status] || {};
      case ACT_TYPE_TRANSACTION:
        return activityConsts[activity_type]?.[request_type]?.[status] || {};
      default:
        return {};
    }
  }, [activity_type]);

  return (
    <li onClick={() => handleClick({ id, activity_type, reference_id })}>
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
          <p>{description}</p>
        </div>
        <div className="act-amt-status-wrap d-flex">
          <div className="act-status-wrap">
            <button type="button" className={`btn ${classStatus}`}>
              {textStatus}
              {iconStatus}
            </button>
          </div>
          <div className={`act-amt-wrap text-end ${classText}`}>
            {CURRENCY_SYMBOL} {iconAmount}
            {altAmount}
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
