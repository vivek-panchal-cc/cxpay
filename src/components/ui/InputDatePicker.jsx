import React from "react";
import { IconCalender } from "styles/svgs";

const InputDatePicker = (props) => {
  const { className = "", onClick = () => {}, date } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const dateText = date ? date?.toLocaleDateString("en-UK") : "DD/MM/YYYY";

  return (
    <div className={`${className}`} onClick={onClick}>
      <input
        id={`date${randomStr}`}
        type="text"
        className="form-control-recurring"
        placeholder="DD/MM/YYYY"
        value={`${dateText}`}
        readOnly
      />
      <span className="date-cal">
        <IconCalender style={{ stroke: "#c4c4c4" }} />
      </span>
    </div>
  );
};

export default InputDatePicker;
