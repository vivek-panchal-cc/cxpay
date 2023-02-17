import React from "react";

function Info(props) {
  const { className, style } = props;
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M11.7168 21.281C17.2396 21.281 21.7168 16.8039 21.7168 11.281C21.7168 5.75816 17.2396 1.28101 11.7168 1.28101C6.19395 1.28101 1.7168 5.75816 1.7168 11.281C1.7168 16.8039 6.19395 21.281 11.7168 21.281Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7168 15.281V11.281"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.7168 7.28101H11.7268"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Info;
