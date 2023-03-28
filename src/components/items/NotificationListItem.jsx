import React from "react";
import { IconNotifyDelete, IconNotifyMoneySent } from "styles/svgs";

function NotificationListItem(props) {
  const { showDeleteButton, notification, className } = props;
  const { id, message } = notification || {};

  return (
    <li>
      <div className={`notification-pcw ${className}`}>
        <div className="notifi-ic-wrap">
          <IconNotifyMoneySent />
        </div>
        <div className="notifi-content">
          <p>{message}</p>
          <p className="notifi-tran-idw">
            Transection ID : <span>{id}</span>
            <br />
            Amount : <span>1234</span>
          </p>
        </div>
      </div>
      {showDeleteButton && (
        <div className="notification-rm-wrap">
          <IconNotifyDelete />
        </div>
      )}
    </li>
  );
}

export default NotificationListItem;
