import React from "react";

function Card(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="33"
      viewBox="0 0 35 33"
      fill="none"
      {...props}
    >
      <path
        d="M9.79956 8.80646H16.9315"
        stroke="inherit"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.89258 18.1302H33.5363"
        stroke="inherit"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.74805 23.2615H32.6813"
        stroke="inherit"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.20605 16.0254C1.20605 4.77455 5.28982 1.02539 17.5444 1.02539C29.7974 1.02539 33.8812 4.77455 33.8812 16.0254C33.8812 27.2746 29.7974 31.0254 17.5444 31.0254C5.28982 31.0254 1.20605 27.2746 1.20605 16.0254Z"
        stroke="inherit"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Card;
