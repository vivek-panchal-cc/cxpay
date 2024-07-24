import React from "react";
import { IconCalender } from "styles/svgs";

const convertDateFormat = (dateString) => {
  const [month, day, year] = dateString.split("/");
  return `${day}/${month}/${year}`;
};

const InputDateRangeRecurring = (props) => {
  const { className = "", onClick = () => {}, startDate, endDate, isSchedule = false } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const fromText = isSchedule && startDate ? convertDateFormat(startDate) : startDate || "From";
  const toText = isSchedule && endDate ? convertDateFormat(endDate) : endDate || "To";

  // const fromText = startDate ? startDate : "From";
  // const toText = endDate ? endDate : "To";

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

export default InputDateRangeRecurring;
