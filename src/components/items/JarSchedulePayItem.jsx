import React, { useMemo } from "react";
import {
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import { IconBin, IconEdit } from "styles/svgs";
import WrapAmount from "components/wrapper/WrapAmount";
import { getInitials, getRandomColorClass } from "constants/all";

const JarSchedulePayItem = (props) => {
  const { activityDetails, handleClick, handleDelete } = props || {};
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
    payment_schedule_date,
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
    <li>
      <div className="act-info-wrap-left justify-content-between">
        <div
          className="align-items-center d-flex"
          style={{ minWidth: "250px", maxWidth: "250px" }}
        >
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
              {formatDate(payment_schedule_date)}
            </span>
          </div>
        </div>
        <div>
          <span className="jar-sch-pay-date">
            {formatDate(payment_schedule_date)}
          </span>
        </div>
        <div className="jar-rec-pay-rec d-flex justify-content-end">
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
      <div className="jar-act-mv-wrap">
        <div className="act-edit-btn">
          <div className="d-flex right-activity-div">
            <button
              className={`act-edit-wrap rounded `}
              onClick={(e) => {
                e.stopPropagation();
                handleClick({ id });
              }}
              style={{
                background: "#0081C5",
                width: "33px",
                height: "32px",
              }}
            >
              <IconEdit style={{ stroke: "#FFF" }} />
            </button>
            <button
              className={`act-del-wrap rounded`}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete({ id });
              }}
              style={{ background: "#FF3333" }}
            >
              <IconBin style={{ stroke: "#F3F3F3" }} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default JarSchedulePayItem;
