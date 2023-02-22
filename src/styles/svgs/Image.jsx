import React from "react";

function Image(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <path
        d="M20 4C19.5 3 19 2.5 18 2C18 2 13.8431 1 11 1C8.15694 1 4 2 4 2C3 2.5 2.5 3 2 4C2 4 1 8.23858 1 11C1 13.7614 2 18 2 18C2.5 19 2.5 19.5 4 20C4 20 8.15694 21 11 21C13.8431 21 18 20 18 20C19 19.5 19.5 19 20 18C20 18 21 13.7614 21 11C21 8.23858 20 4 20 4Z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9C8.32843 9 9 8.32843 9 7.5C9 6.67157 8.32843 6 7.5 6C6.67157 6 6 6.67157 6 7.5C6 8.32843 6.67157 9 7.5 9Z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14L15 9L4 20"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Image;
