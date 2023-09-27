import React, { forwardRef, useCallback } from "react";
import styles from "./input.module.scss";

const InputNumber = forwardRef((props, ref) => {
  const {
    labelname,
    error,
    disabled,
    type,
    classNameContainer = "",
    ...rest
  } = props;

  const handleWheel = (e) => {
    e.preventDefault();

    let value = +e.currentTarget.value; // Convert string to number

    if (e.deltaY < 0) {
      // Scrolling up
      value = Math.min(value + 1, +props.max);
    } else {
      // Scrolling down
      value = Math.max(value - 1, +props.min);
    }

    e.currentTarget.value = value;

    if (props.onChange) {
      props.onChange(e); // Notify parent component about the change
    }
  };

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

  // const changeElement = (element) => {
  //   // Allow user to clear the input
  //   if (!element.currentTarget.value) {
  //     return element;
  //   }

  //   if (element?.target?.name == "email") {
  //     element.currentTarget.value = element.currentTarget.value.trim();
  //   }

  //   // Enforce min and max for type="number"
  //   if (type === "number") {
  //     if (+element.currentTarget.value < +props.min) {
  //       element.currentTarget.value = props.min;
  //     } else if (+element.currentTarget.value > +props.max) {
  //       element.currentTarget.value = props.max;
  //     }
  //   }
  //   switch (type) {
  //     case "mobile":
  //       element.currentTarget.value = element.currentTarget.value.trim();
  //       return element;
  //     case "name":
  //       element.currentTarget.value = element.currentTarget.value.trimStart();
  //       return element;
  //     case "text-uppercase":
  //       element.currentTarget.value = element.currentTarget.value.toUpperCase();
  //       return element;
  //     default:
  //       return element;
  //   }
  // };

  const changeElement = (element) => {
    let value = element.currentTarget.value;

    // Allow user to clear the input
    if (!value) {
      return value;
    }

    if (type === "number") {
      if (value.length > 2) {
        value = value.substring(0, 2); // Take the first two digits only
      }
      if (+value > +props.max) {
        value = value.substring(0, value.length - 1); // Trim the last character
      } else if (+value < +props.min && !/^0+$/.test(value)) {
        value = props.min;
      }
    }

    // The rest of your code remains unchanged...
    switch (type) {
      case "mobile":
        value = value.trim();
        break;
      case "name":
        value = value.trimStart();
        break;
      case "text-uppercase":
        value = value.toUpperCase();
        break;
      default:
        break;
    }

    return value;
  };

  return (
    <div className={`d-flex flex-column form-field ${classNameContainer}`}>
      {labelname ? (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      ) : null}
      <input
        {...rest}
        type={getType()}
        onChange={(e) => {
          const newValue = changeElement(e);
          if (props.onChange) {
            e.currentTarget.value = newValue; // Set the adjusted value back
            props.onChange(e);
          }
        }}
        onWheel={handleWheel}
        className={`${styles.number_input} ${props.className} ${
          disabled ? "cursor-not-allowed" : ""
        }`}
        ref={ref}
      />
      {error ? <p className="text-danger ps-2">{error}</p> : null}
    </div>
  );
});

export default InputNumber;
