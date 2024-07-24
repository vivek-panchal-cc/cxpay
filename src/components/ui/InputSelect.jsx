import React from "react";

function InputSelect(props) {
  const { labelname, error, disabled } = props;
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
      <p className="text-danger ps-2">{error}</p>
    </div>
  );
}

export default InputSelect;
