import React from "react";

function InputSwitch(props) {
  const {
    id = Math.round(Math.random() * 1000).toString(),
    labelOffText,
    labelOnText,
    ...inputProps
  } = props;

  return (
    <div className="form-check form-switch">
      <input id={`switchInput${id}`} type="checkbox" {...inputProps} />
      <label className="form-check-label" htmlFor={`switchInput${id}`}>
        {labelOffText}
      </label>
      <label className="form-check-label" htmlFor={`switchInput${id}`}>
        {labelOnText}
      </label>
    </div>
  );
}

export default InputSwitch;
