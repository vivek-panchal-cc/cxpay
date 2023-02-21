import React from 'react';

const Contact = (props) => {
    const {className, style} = props;
    return (
        <svg
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            >
            <path
                d="M9.02072 8.55317C11.1065 8.55317 12.7973 6.86233 12.7973 4.77658C12.7973 2.69083 11.1065 1 9.02072 1C6.93498 1 5.24414 2.69083 5.24414 4.77658C5.24414 6.86233 6.93498 8.55317 9.02072 8.55317Z"
                stroke="inherit"
                stroke-width="1.29114"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M15.9606 18.0001C16.6708 18.0001 17.2195 17.3115 16.9935 16.6229C15.9068 13.2551 12.7543 10.8127 9.02075 10.8127C5.28721 10.8127 2.13467 13.2551 1.04796 16.6229C0.832774 17.3007 1.37075 18.0001 2.08088 18.0001H15.9606Z"
                stroke="inherit"
                stroke-width="1.29114"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

export default Contact;
