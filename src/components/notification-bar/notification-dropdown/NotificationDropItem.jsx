import React from "react";

const NotificationDropItem = () => {
  const { path, children } = props;

  return (
    <li {...props}>
      <Link to={path}>{children}</Link>
    </li>
  );
};

export default NotificationDropItem;
