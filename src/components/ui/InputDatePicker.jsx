import React from "react";
import { IconCalender } from "styles/svgs";

const InputDatePicker = (props) => {
  const { className = "", onClick = () => {}, date, placeholder } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const convertToDateObject = (dateInput) => {
    if (dateInput instanceof Date) {
      return dateInput;
    }

    if (typeof dateInput === "string") {
      // Handle YYYY-MM-DD format
      if (dateInput.includes("-")) {
        const [year, month, day] = dateInput
          .split("-")
          .map((str) => parseInt(str, 10));
        return new Date(year, month - 1, day); // Month is 0-indexed in JS
      }

      // Handle DD/MM/YYYY format
      if (dateInput.includes("/")) {
        const [day, month, year] = dateInput
          .split("/")
          .map((str) => parseInt(str, 10));
        return new Date(year, month - 1, day);
      }
    }

    return null;
  };

  const dateObj = convertToDateObject(date);
  const dateText = dateObj
    ? dateObj.toLocaleDateString("en-UK")
    : placeholder
    ? placeholder
    : "DD/MM/YYYY";

  return (
    <div className={`${className}`} onClick={onClick}>
      <input
        id={`date${randomStr}`}
        type="text"
        className="form-control-recurring"
        placeholder={placeholder ? placeholder : "DD/MM/YYYY"}
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
