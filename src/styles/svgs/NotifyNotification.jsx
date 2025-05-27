import React from "react";

function NotifyNotification(props) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Green Background Circle */}
      <path
        d="M1.09066 18.3913C3.10427 9.80698 9.80699 3.10427 18.3913 1.09066C24.5908 -0.363551 31.0427 -0.363552 37.2422 1.09065C45.8266 3.10427 52.5293 9.80699 54.5429 18.3913C55.9971 24.5908 55.9971 31.0427 54.5429 37.2422C52.5293 45.8266 45.8266 52.5293 37.2422 54.5429C31.0427 55.9971 24.5908 55.9971 18.3913 54.5429C9.80699 52.5293 3.10427 45.8266 1.09066 37.2423C-0.363553 31.0427 -0.363552 24.5908 1.09066 18.3913Z"
        fill="#93E06F"
        fillOpacity="0.25"
      />

      {/* Centered Notification Icon */}
      <g transform="translate(18, 15)">
        <path
          d="M17.5303 16.3801H3.80029V8.4701C3.80029 4.6801 6.87029 1.6001 10.6703 1.6001C14.4603 1.6001 17.5403 4.6701 17.5403 8.4701V16.3801H17.5303Z"
          stroke="#363853"
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#daf3d9"
        />
        <path
          d="M1.6001 16.3801H19.7301"
          stroke="#363853"
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6801 18.3701C12.6801 19.4801 11.7801 20.3901 10.6601 20.3901C9.54014 20.3901 8.64014 19.4901 8.64014 18.3701"
          stroke="#363853"
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default NotifyNotification;
