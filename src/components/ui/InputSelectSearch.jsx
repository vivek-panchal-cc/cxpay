import React from "react";

function InputSelectSearch(props) {
  const { labelname, disabled } = props;
  return (
    <div className={`d-flex flex-column form-field`}>
      {labelname ? (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      ) : null}
      <select
        {...props}
        className={`${props.className} ${disabled ? "cursor-not-allowed" : ""}`}
      ></select>      
    </div>
  );
}

export default InputSelectSearch;
