import React from "react";

function CardBackground(props) {
  const { height = 359, width = 213 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 359 213"
      fill="none"
      {...props}
    >
      <mask
        id="mask0_1_2975"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="0"
        width="356"
        height="213"
      >
        <rect
          x="3.00098"
          width="355.063"
          height="212.109"
          rx="35.6841"
          fill="#6456FF"
          fillOpacity="0.5"
        />
      </mask>
      <g mask="url(#mask0_1_2975)">
        <path
          opacity="0.6"
          d="M273.971 100.546C308.598 77.4064 358.065 100.546 358.065 100.546V212.109H81.5991C81.5991 212.109 94.2407 134.52 177.235 145.079C260.23 155.639 239.344 123.685 273.971 100.546Z"
          fill="url(#paint0_linear_1_2975)"
          fillOpacity="0.8"
        />
        <path
          opacity="0.6"
          d="M302.002 153.802C349.82 118.91 358.064 67.0303 358.064 67.0303V212.109H56.8652C56.8652 212.109 75.0031 164.758 148.104 173.085C221.206 181.411 254.184 188.695 302.002 153.802Z"
          fill="url(#paint1_linear_1_2975)"
          fillOpacity="0.8"
        />
        <path
          opacity="0.6"
          d="M38.1769 40.861C24.436 50.8876 0.801804 44.5339 0.801804 44.5339L3.00032 0.000183105L127.767 0.000179291C127.767 0.000179291 104.682 23.4148 79.3994 20.6602C54.1162 17.9055 51.9177 30.8345 38.1769 40.861Z"
          fill="url(#paint2_linear_1_2975)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1_2975"
          x1="166.243"
          y1="58.7665"
          x2="234.309"
          y2="199.38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.144388" stopColor="#6730DD" />
          <stop offset="1" stopColor="#3E188E" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_2975"
          x1="151.402"
          y1="28.465"
          x2="243.986"
          y2="226.392"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.144388" stopColor="#602AD5" />
          <stop offset="1" stopColor="#3E188E" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1_2975"
          x1="119.154"
          y1="103.216"
          x2="67.1171"
          y2="-8.02737"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.144388" stopColor="#3E188E" />
          <stop offset="1" stopColor="#3E188E" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default CardBackground;
