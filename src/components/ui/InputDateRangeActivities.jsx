import React from "react";
import { IconCalender } from "styles/svgs";

const InputDateRangeActivities = (props) => {
  const { className = "", onClick = () => {}, startDate, endDate } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const fromText = startDate ? startDate : "From";
  const toText = endDate ? endDate : "To";

  return (
    <div className={`${className}`} onClick={onClick}>
      <input
        id={`from-date${randomStr}`}
        type="text"
        className="form-control"
        placeholder="From"
        value={`${fromText} - ${toText}`}
        readOnly
      />
      <span className="date-cal">
        <IconCalender style={{ stroke: "#c4c4c4" }} />
      </span>
    </div>
  );
};

export default InputDateRangeActivities;
