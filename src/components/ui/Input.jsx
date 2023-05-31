import React, { forwardRef } from "react";
import styles from "./input.module.scss";

const Input = forwardRef((props, ref) => {
  const { labelname, error, disabled, type } = props;

  const getType = () => {
    switch (type) {
      case "mobile":
        return "text";
      case "name":
        return "text";
      case "text-uppercase":
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
      case "name":
        element.currentTarget.value = element.currentTarget.value.trimStart();
        return element;
      case "text-uppercase":
        element.currentTarget.value = element.currentTarget.value.toUpperCase();
        return element;
      default:
        return element;
    }
  };

  return (
    <div className={`d-flex flex-column form-field`}>
      {labelname ? (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      ) : null}
      <input
        {...props}
        type={getType()}
        onChange={(e) => props?.onChange(changeElement(e))}
        className={`${styles.number_input} ${props.className} ${
          disabled ? "cursor-not-allowed" : ""
        }`}
        ref={ref}
      />
      {error ? <p className="text-danger ps-2">{error}</p> : null}
    </div>
  );
});

export default Input;
