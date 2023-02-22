import React from "react";

function Notification(props) {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        cliprule="evenodd"
        d="M8.38164 1C3.94735 1 2.02069 5.01524 2.02069 7.66952C2.02069 9.65333 2.3083 9.06952 1.21021 11.4895C-0.130743 14.9381 5.26164 16.3476 8.38164 16.3476C11.5007 16.3476 16.8931 14.9381 15.5531 11.4895C14.455 9.06952 14.7426 9.65333 14.7426 7.66952C14.7426 5.01524 12.815 1 8.38164 1Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.6913 18.998C9.397 20.4437 7.37796 20.4608 6.07129 18.998"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Notification;
