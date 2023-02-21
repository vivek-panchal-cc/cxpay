import React from 'react';

const RightArrowBig = (props) => {
    const {className, style} = props;
    return (
        <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            >
            <path
                d="M1.3335 1.33341L8.00016 8.00008L1.3335 14.6667"
                stroke-width="2"
                strokeMiterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#363853"
            />
        </svg>
    );
}

export default RightArrowBig;
