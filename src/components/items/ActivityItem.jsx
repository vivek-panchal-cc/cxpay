import React, { useMemo } from "react";
import {
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import { IconEyeOpen } from "styles/svgs";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDate } from "helpers/commonHelpers";

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
    txn_type,
    user_type,
    activity_type,
    reference_id,
    date,
    profile_image,
  } = activityDetails || {};

  const profileUrl =
    profile_image || "/assets/images/single_contact_profile.png";
  const altAmount = typeof amount === "number" ? amount.toFixed(2) : "";

  const {
    iconStatus = "",
    iconAmount = "",
    classStatus = "",
    classText = "",
    textStatus = "",
    description = "",
  } = useMemo(() => {
    if (!activity_type) return {};
    let details = {};
    switch (activity_type) {
      case ACT_TYPE_REQUEST:
        details = activityConsts[activity_type]?.[request_type]?.[status];
        break;
      case ACT_TYPE_TRANSACTION:
        details =
          activityConsts[activity_type]?.[request_type]?.[txn_type]?.[status];
        break;
      default:
        return {};
    }
    const { desc = "" } = details || {};
    const aDesc =
      desc?.replace(/XXXX/g, altAmount).replace(/YYYY/, name) || specification;
    return Object.assign({ ...details }, { description: aDesc });
  }, [activity_type, request_type, status]);

  return (
    <li onClick={() => handleClick({ id, activity_type, reference_id })}>
      <div className="act-info-wrap-left">
        <div className="act-user-info-wrap d-flex">
          <div className="act-user-thumb">
            <img src={profileUrl} alt="" />
          </div>
          <div className="act-user-in">
            <h2>{name || specification}</h2>
            <p>{formatDate(date)}</p>
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
            <WrapAmount
              value={altAmount}
              prefix={`${CURRENCY_SYMBOL} ${
                iconAmount === "-" ? "" : iconAmount
              }`}
            />
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
