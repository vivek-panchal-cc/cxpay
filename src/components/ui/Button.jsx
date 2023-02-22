import React from "react";

const Button = (props) => {
  const { theme, className, children } = props;
  // theme: outline-btn , btn-primary

  return (
    <button {...props} className={`btn ${theme} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
