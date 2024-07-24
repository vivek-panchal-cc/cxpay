import React from "react";

function NotifyDelete(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <rect width="48" height="48" rx="8" fill="#F7F7F9" />
      <path
        d="M30 18L18 30"
        stroke="#FF3333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 18L30 30"
        stroke="#FF3333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default NotifyDelete;
