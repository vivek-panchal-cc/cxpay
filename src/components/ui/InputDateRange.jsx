import React from "react";
import { IconCalender } from "styles/svgs";

const InputDateRange = (props) => {
  const { className = "", handleClick, startDate, endDate } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const fromText = startDate ? startDate?.toLocaleDateString("en-UK") : "From";
  const toText = endDate ? endDate?.toLocaleDateString("en-UK") : "To";

  return (
    <div className={`${className}`} onClick={handleClick}>
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

export default InputDateRange;
