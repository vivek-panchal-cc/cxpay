import React, { useEffect } from "react";
import { IconNotifyDelete, IconNotifyMoneySent } from "styles/svgs";

function NotificationListItem(props) {
  const { showDeleteButton, notification, className } = props;
  const { id, message } = notification || {};

  return (
    <li>
      <div class={`notification-pcw ${className}`}>
        <div class="notifi-ic-wrap">
          <IconNotifyMoneySent />
        </div>
        <div class="notifi-content">
          <p>{message}</p>
          <p class="notifi-tran-idw">
            Transection ID : <span>{id}</span>
            <br />
            Amount : <span>1234</span>
          </p>
        </div>
      </div>
      {showDeleteButton && (
        <div class="notification-rm-wrap">
          <IconNotifyDelete />
        </div>
      )}
    </li>
  );
}

export default NotificationListItem;
