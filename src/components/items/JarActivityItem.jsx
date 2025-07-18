import React, { useMemo } from "react";
import {
  CURRENCY_SYMBOL,
  JAR_FUND_ADD,
  JAR_FUND_WITHDRAW,
  JAR_MEMBER_ADD,
  jarActvityConsts,
} from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { getInitials, getRandomColorClass } from "constants/all";
import LoaderImageWithSkeleton from "loaders/LoaderImageWithSkeleton";

const JarActivityItem = (props) => {
  const { activityDetails, handleClick } = props || {};
  const {
    id,
    specification,
    amount,
    status,
    name,
    activity_type,
    reference_id,
    profile_image,
    created_at,
    type,
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
    if (!type) return {};
    let details = {};
    switch (type) {
      case JAR_FUND_ADD:
        details = jarActvityConsts[type]?.[status];
        break;
      case JAR_FUND_WITHDRAW:
        details = jarActvityConsts[type]?.[status];
        break;
      case JAR_MEMBER_ADD:
        details = jarActvityConsts[type]?.[status];
        break;
      default:
        return {};
    }
    const { desc = "" } = details || {};
    const aDesc =
      desc?.replace(/XXXX/g, altAmount).replace(/YYYY/, name) || specification;
    return Object.assign({ ...details }, { description: desc });
  }, [type, status]);

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
        <div
          className="align-items-center d-flex"
          style={{ minWidth: "250px", maxWidth: "250px" }}
        >
          <div className="act-user-thumb">
            {/* <img src={profileUrl} alt="" /> */}
            {profile_image ? (
              <LoaderImageWithSkeleton
                src={profile_image}
                className="blue-bg"
              />
            ) : (
              // <img src={profile_image} className="blue-bg" alt="" />
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
            {/* <p>{formatDate(txn_completed_at)}</p> */}
          </div>
        </div>
        <div>
          <span style={{ alignItems: "start" }}>{formatDate(created_at)}</span>
        </div>
        <div className="jar-act-pay-rec d-flex justify-content-end">
          {altAmount > 0 ? (
            <div className={`act-amt-wrap text-end ${classText}`}>
              <WrapAmount
                value={altAmount}
                prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
              />
            </div>
          ) : (
            <span
              style={{ textTransform: "unset" }}
              className={`act-amt-wrap ${classText}`}
            >
              {description}
            </span>
          )}
        </div>
      </div>
      {/* <div className="act-mv-wrap">
        <div className="act-edit-btn">
          <button>
            <IconEyeOpen />
          </button>
        </div>
      </div> */}
    </li>
  );
};

export default JarActivityItem;
