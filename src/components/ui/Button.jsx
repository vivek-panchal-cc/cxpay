import React from "react";

const Button = (props) => {
  const { children } = props;
  // theme: outline-btn , btn-primary

  return <button {...props}>{children}</button>;
};

export default Button;
