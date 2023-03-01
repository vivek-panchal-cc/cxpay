import React from 'react';
import { Link } from 'react-router-dom';

const ProfileDropItem = (props) => {
    const {path, children} = props;

    return (
        <li {...props}>
            <Link to={path}>
                {children}
            </Link>
        </li>
    );
}

export default ProfileDropItem;
