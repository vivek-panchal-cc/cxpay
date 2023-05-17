import { CURRENCY_SYMBOL } from "constants/all";
import React, { useMemo } from "react";
import { IconBin, IconEdit } from "styles/svgs";

const SchedulePaymentItem = (props) => {
  const { details, handleEdit, handleDelete } = props;
  const {
    id,
    name = "",
    dateTime = "",
    description = "",
    amount = "",
    profileImg = "",
  } = details || {};

  const { dtString } = useMemo(() => {
    if (!dateTime) return { dtString: "" };
    const dt = new Date(dateTime);
    const dtString = dt
      .toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
      .replace(", ", ", at ")
      .replace(/-/g, " ");
    return { dtString };
  }, [dateTime]);

  return (
    <li>
      <div className="left-activity-div">
        <div className="user-thumb-name">
          <img src={profileImg} alt="" />
          <span>{name}</span>
        </div>
        <div className="activity-date">{dtString}</div>
        <div className="act-spec-add">{description}</div>
        <div className="seleted-value">
          {CURRENCY_SYMBOL} -{amount.toFixed(2)}
        </div>
      </div>
      <div className="right-activity-div">
        <button
          className="act-edit-wrap rounded"
          onClick={() => handleEdit(id)}
          style={{
            background: "#0081C5",
            width: "33px",
            height: "32px",
          }}
        >
          <IconEdit style={{ stroke: "#FFF" }} />
        </button>
        <button
          className="act-del-wrap rounded"
          onClick={() => handleDelete(id)}
          style={{ background: "#FF3333" }}
        >
          <IconBin style={{ stroke: "#F3F3F3" }} />
        </button>
      </div>
    </li>
  );
};

export default SchedulePaymentItem;
