import React from "react";

const Add = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="9.35" strokeWidth="1.3" stroke="#363853" />
      <rect
        x="11.2998"
        y="6"
        width="1.3"
        height="12"
        rx="0.65"
        fill="#363853"
      />
      <rect
        x="18"
        y="11.3"
        width="1.3"
        height="12"
        rx="0.65"
        transform="rotate(90 18 11.3)"
        fill="#363853"
      />
    </svg>
  );
};

export default Add;
