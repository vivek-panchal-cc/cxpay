import React from 'react';

const Button = (props) => {
    const {theme, className, children, onClick} = props;
    // theme: outline-btn , btn-primary

    return (
        <button {...props} className={`btn ${theme} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
