import React, { useMemo } from "react";
import {
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import { IconEyeOpen } from "styles/svgs";
import WrapAmount from "components/wrapper/WrapAmount";
import { getInitials, getRandomColorClass } from "constants/all";

const JarRecurringPayItem = (props) => {
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
    created_at,
  } = activityDetails || {};

  const altAmount =
    typeof amount === "string"
      ? parseFloat(amount)?.toFixed(2)
      : amount?.toFixed(2);

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

  const formatDate = (dateObj) => {
    if (!(dateObj instanceof Date)) {
      dateObj = new Date(dateObj); // Convert string to Date object
    }
    if (!isNaN(dateObj.getTime())) {
      // Ensure it's a valid date
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return null;
  };

  return (
    <li onClick={() => handleClick({ id, activity_type, reference_id })}>
      <div className="act-info-wrap-left justify-content-between">
        <div className="align-items-center d-flex">
          <div className="act-user-thumb">
            {/* <img src={profileUrl} alt="" /> */}
            {profile_image ? (
              <img src={profile_image} className="blue-bg" alt="" />
            ) : (
              <div
                className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                  name
                )}`}
              >
                {getInitials(name)}
              </div>
            )}
          </div>
          <div className="act-user-in">
            <h2>{name}</h2>
            <span className="jar-recent-sch-pay-date">
              {formatDate(created_at)}
            </span>
          </div>
        </div>
        <div>
          <span className="jar-sch-pay-date">{formatDate(created_at)}</span>
        </div>
        <div className="d-flex">
          <div className={`act-amt-wrap text-end cx-color-green`}>
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

export default JarRecurringPayItem;
