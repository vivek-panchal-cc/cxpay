import React from "react";
// #F3F3F3 blank
// #F9DB3E filled
const BackgroundStar = ({ fillBack = "#F3F3F3", fillStar = "", ...props }) => {
  return (
    <>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect width="32" height="32" rx="8" fill={fillBack} />
        <path
          d="M16 9L18.163 13.2787L23 13.969L19.5 17.2976L20.326 22L16 19.7787L11.674 22L12.5 17.2976L9 13.969L13.837 13.2787L16 9Z"
          stroke={fillStar ? fillStar : "#969696"}
          fill={fillStar}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default BackgroundStar;
