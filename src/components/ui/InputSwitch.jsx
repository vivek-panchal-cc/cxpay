import React from "react";

function InputSwitch(props) {
  const {
    id = Math.round(Math.random() * 1000).toString(),
    labelOffText,
    labelOnText,
  } = props;

  return (
    <div className="form-check form-switch">
      <input id={`switchInput${id}`} type="checkbox" {...props} />
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
