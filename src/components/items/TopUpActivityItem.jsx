import React, { useMemo } from "react";
import {
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import { IconEyeOpen } from "styles/svgs";
import WrapAmount from "components/wrapper/WrapAmount";

const TopUpActivityItem = (props) => {
  const { activityDetails, handleClick, visibleIcon } = props || {};
  const {
    id,
    specification,
    amount,
    status,
    name,
    request_type,
    txn_type,
    activity_type,
    reference_id,
    date,
    profile_image,
    agent_commission,
    card_commission,
    customer_name,
    system_commission,
    topup_amount,
  } = activityDetails || {};

  const profileUrl =
    profile_image || "/assets/images/single_contact_profile.png";
  const altAmount = typeof amount === "number" ? amount.toFixed(2) : "";

  const parseOrZero = (value) =>
    typeof value === "number" ? value : parseFloat(value) || 0;

  const totalCommission =
    parseOrZero(agent_commission) +
    parseOrZero(card_commission) +
    parseOrZero(system_commission);

  const formattedTotalCommission = totalCommission.toFixed(2);

  const sumOfTopUpAndCommission = parseOrZero(topup_amount) + totalCommission;
  const formattedSum = sumOfTopUpAndCommission.toFixed(2);

  const labelStyle = {
    fontSize: "12px",
    lineHeight: "13px",
    padding: "0px",
    margin: "0px",
    color: "#969696",
    textAlign: "center",
  };

  const { iconAmount = "", classText = "" } = useMemo(() => {
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
    <tr onClick={() => handleClick({ id, activity_type, reference_id })}>
      <td className="act-user-info-wrap d-flex">
        <div className="act-user-thumb">
          <img src={profileUrl} alt="" />
        </div>
        <div className="act-user-in">
          <h2>{customer_name}</h2>
          <p>{date}</p>
        </div>
      </td>
      <td className={`act-amt-wrap text-end ${classText}`}>
        <div style={labelStyle}>
          <WrapAmount
            value={topup_amount}
            prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
          />
        </div>
      </td>
      <td className={`act-amt-wrap text-end ${classText}`}>
        <div style={labelStyle}>
          <WrapAmount
            value={formattedTotalCommission}
            prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
          />
        </div>
      </td>
      <td className={`act-amt-wrap text-end ${classText}`}>
        <div style={labelStyle}>
          <WrapAmount
            value={formattedSum}
            prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
          />
        </div>
      </td>
      {visibleIcon && (
        <td className="act-edit-btn">
          <button>
            <IconEyeOpen />
          </button>
        </td>
      )}
    </tr>
  );
};

export default TopUpActivityItem;
