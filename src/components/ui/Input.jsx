import React from "react";

function Input(props) {
  const { labelname, error } = props;

  return (
    <div className="d-flex flex-column form-field">
      {labelname && (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      )}
      <input {...props} />
      <p className="text-danger ps-2">{error}</p>
    </div>
  );
}

export default Input;
