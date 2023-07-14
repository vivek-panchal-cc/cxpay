import React from "react";

const PlusBorder = (props) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.58813 14.9174C6.67396 10.2883 10.2883 6.67395 14.9174 5.58813C18.2604 4.80396 21.7396 4.80396 25.0826 5.58813C29.7117 6.67395 33.3261 10.2883 34.4119 14.9174C35.196 18.2604 35.196 21.7396 34.4119 25.0826C33.326 29.7117 29.7117 33.3261 25.0826 34.4119C21.7396 35.196 18.2604 35.196 14.9174 34.4119C10.2884 33.3261 6.67396 29.7117 5.58813 25.0826C4.80396 21.7396 4.80396 18.2604 5.58813 14.9174Z"
        stroke="inherit"
        strokeWidth="2.5"
      />
      <path
        d="M20.0002 15.8333L20.0002 24.1667M24.1668 20L15.8335 20"
        stroke="inherit"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PlusBorder;
