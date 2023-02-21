import React from 'react';

const Wallet = (props) => {
    const {className, style} = props;
    return (
        <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            >
            <path
                d="M19.8525 12.1966H15.8825C14.4369 12.1966 13.2646 11.0244 13.2646 9.5778C13.2646 8.1322 14.4369 6.95996 15.8825 6.95996H19.8214"
                stroke="#F3F3F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.3296 9.5179H16.0261"
                stroke="#F3F3F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5.99707 5.52474H10.1442"
                stroke="#F3F3F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 9.72224C1 3.18007 3.37463 1 10.5005 1C17.6254 1 20 3.18007 20 9.72224C20 16.2634 17.6254 18.4445 10.5005 18.4445C3.37463 18.4445 1 16.2634 1 9.72224Z"
                stroke="#F3F3F3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default Wallet;
