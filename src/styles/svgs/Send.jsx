import React from 'react';

const Send = (props) => {
    const {className, style} = props;
    return (
        <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.26521 9.73485C9.26521 9.73485 -1.58895 7.48946 2.18293 5.31208C5.36591 3.47479 16.3354 0.315913 17.868 1.13211C18.6841 2.66462 15.5253 13.6342 13.688 16.8171C11.5106 20.589 9.26521 9.73485 9.26521 9.73485Z"
          stroke="inherit"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.26562 9.73483L17.8684 1.13208"
          stroke="inherit"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
}

export default Send;
