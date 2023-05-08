import React from "react";

const Bin = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      {...props}
    >
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0H25C29.4183 0 33 3.58172 33 8V24C33 28.4183 29.4183 32 25 32H8C3.58172 32 0 28.4183 0 24V8Z"
        fill="inherit"
      />
      <path
        d="M8 10.5996H9.8H24.2"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.3998 10.6V23.2C22.3998 23.6774 22.2102 24.1352 21.8726 24.4728C21.535 24.8104 21.0772 25 20.5998 25H11.5998C11.1224 25 10.6646 24.8104 10.327 24.4728C9.98945 24.1352 9.7998 23.6774 9.7998 23.2V10.6M12.4998 10.6V8.8C12.4998 8.32261 12.6894 7.86477 13.027 7.52721C13.3646 7.18964 13.8224 7 14.2998 7H17.8998C18.3772 7 18.835 7.18964 19.1726 7.52721C19.5102 7.86477 19.6998 8.32261 19.6998 8.8V10.6"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2998 15.0996V20.4996"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.8999 15.0996V20.4996"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Bin;
