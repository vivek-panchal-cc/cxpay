import React from 'react';

const Cross = (props) => {
    return (
        <svg
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
            d="M13 1L0.999999 13"
            stroke="inherit"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            <path
            d="M1 1L13 13"
            stroke="inherit"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            />
        </svg>
    );
}

export default Cross;
