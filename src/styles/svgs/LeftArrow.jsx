import React from 'react';

const LeftArrow = (props) => {
    const {className, style} = props;

    return (
        <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <path
          d="M7 13L1 7L7 1"
          stroke="inherit"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
}

export default LeftArrow;
