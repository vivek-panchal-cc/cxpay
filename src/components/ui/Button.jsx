import React from "react";

const Button = (props) => {
  const { children, type } = props;
  // theme: outline-btn , btn-primary

  return (
    <button type={type || "button"} {...props}>
      {children}
    </button>
  );
};

export default Button;
