import React from "react";

function Input(props) {
  const { labelname, error, disabled, type } = props;

  const getType = () => {
    switch (type) {
      case "mobile":
        return "text";
      default:
        return type;
    }
  };

  const changeElement = (element) => {
    switch (type) {
      case "mobile":
        element.currentTarget.value = element.currentTarget.value.trim();
        return element;
      default:
        return element;
    }
  };

  return (
    <div className={`d-flex flex-column form-field`}>
      {labelname && (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      )}
      <input
        {...props}
        type={getType()}
        onChange={(e) => props?.onChange(changeElement(e))}
        className={`${props.className} ${disabled ? "cursor-not-allowed" : ""}`}
      />
      <p className="text-danger ps-2">{error}</p>
    </div>
  );
}

export default Input;
