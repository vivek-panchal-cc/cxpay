import React from "react";

function RightArrow(props) {
  const { className, style } = props;
  return (
    <svg
      width="5"
      height="8"
      viewBox="0 0 5 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M1 1.5L3.5 4L1 6.5"
        stroke="#363853"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default RightArrow;
