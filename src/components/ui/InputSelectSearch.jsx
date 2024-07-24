import React from "react";

function InputSelectSearch(props) {
  const { labelname, disabled } = props;

  const shouldGrayOut = props.value === "" || props.value === "Account Type";
  const selectClassName = `${props.className} ${disabled ? "cursor-not-allowed" : ""} ${shouldGrayOut ? "grayed-out" : ""}`;

  return (
    <div className={`d-flex flex-column form-field`}>
      {labelname ? (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      ) : null}
      <select
        {...props}
        className={selectClassName}
      ></select>      
    </div>
  );
}

export default InputSelectSearch;
