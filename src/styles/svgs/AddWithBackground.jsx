import React from "react";

const AddWithBackground = (props) => {
  return (
    <svg
        width="33" 
        height="33" 
        viewBox="0 0 33 33" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <path
        d="M0.646942 10.9091C1.84135 5.81718 5.81718 1.84135 10.9091 0.646941C14.5865 -0.215646 18.4135 -0.215647 22.0909 0.64694C27.1828 1.84135 31.1587 5.81718 32.3531 10.9091C33.2156 14.5865 33.2156 18.4135 32.3531 22.0909C31.1587 27.1828 27.1828 31.1587 22.0909 32.3531C18.4135 33.2156 14.5865 33.2156 10.9091 32.3531C5.81719 31.1587 1.84135 27.1828 0.646942 22.0909C-0.215647 18.4135 -0.215647 14.5865 0.646942 10.9091Z"
        fill="#0081C5"
      />
      <path
        d="M16 10V24"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M23 17H9" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddWithBackground;
