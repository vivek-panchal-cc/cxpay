import React from "react";

function Lock(props) {
  const { className, style } = props;
  return (
    <svg
      width="18"
      height="21"
      viewBox="0 0 18 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M13.0266 4.23736C12.4536 2.34236 10.6816 0.974364 8.60361 1.00036C6.13661 1.03036 4.14161 3.01736 4.09961 5.48436V7.65336"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.66016 12.4058V14.6268"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.66 7.07379C2.915 7.07379 1 8.64179 1 13.3448C1 18.0488 2.915 19.6168 8.66 19.6168C14.406 19.6168 16.321 18.0488 16.321 13.3448C16.321 8.64179 14.406 7.07379 8.66 7.07379Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Lock;
