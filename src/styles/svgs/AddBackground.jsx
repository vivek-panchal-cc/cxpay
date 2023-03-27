import React from "react";

function AddBackground(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      {...props}
    >
      <path
        d="M0.519514 8.76035C1.47866 4.67137 4.67137 1.47866 8.76036 0.519513C11.7134 -0.173171 14.7866 -0.173171 17.7396 0.519513C21.8286 1.47866 25.0213 4.67138 25.9805 8.76036C26.6732 11.7134 26.6732 14.7866 25.9805 17.7396C25.0213 21.8286 21.8286 25.0213 17.7396 25.9805C14.7866 26.6732 11.7134 26.6732 8.76036 25.9805C4.67138 25.0213 1.47866 21.8286 0.519514 17.7396C-0.173171 14.7866 -0.173171 11.7134 0.519514 8.76035Z"
        fill="inherit"
      />
      <path
        d="M13 18V8"
        stroke="white"
        strokeWidth="2.16959"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13L18 13"
        stroke="white"
        strokeWidth="2.16959"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AddBackground;
