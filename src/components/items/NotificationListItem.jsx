import React from "react";
import { Link } from "react-router-dom";
import { IconNotifyDelete } from "styles/svgs";

function NotificationListItem(props) {
  const { showDeleteButton, notification, className, Icon, redirect } = props;
  const { id, message } = notification || {};

  return (
    <li>
      <Link to={redirect} className="w-100">
        <div className={`notification-pcw ${className}`}>
          <div className="notifi-ic-wrap">{Icon && <Icon />}</div>
          <div className="notifi-content">
            <p>{message}</p>
            <p className="notifi-tran-idw">
              Transection ID : <span>{id}</span>
              <br />
              Amount : <span>1234</span>
            </p>
          </div>
        </div>
      </Link>
      {showDeleteButton && (
        <div className="notification-rm-wrap">
          <IconNotifyDelete />
        </div>
      )}
    </li>
  );
}

export default NotificationListItem;
