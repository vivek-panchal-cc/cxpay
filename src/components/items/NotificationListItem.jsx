import Button from "components/ui/Button";
import React from "react";
import { Link } from "react-router-dom";
import { IconNotifyDelete } from "styles/svgs";

function NotificationListItem(props) {
  const {
    showDeleteButton,
    handleDelete,
    handleRead,
    notification,
    className,
    Icon,
  } = props;
  const { id, message, status } = notification || {};

  return (
    <li className={status ? "" : "un-read-notification"}>
      <div
        onClick={() => handleRead(notification)}
        className="w-100 cursor-pointer"
      >
        <div className={`notification-pcw ${className}`}>
          <div className="notifi-ic-wrap">{Icon && <Icon />}</div>
          <div className="notifi-content">
            <p>{message}</p>
            {/* <p className="notifi-tran-idw">
              <br />
            </p> */}
          </div>
        </div>
      </div>
      {showDeleteButton && (
        <Button
          type="button"
          className="notification-rm-wrap"
          onClick={() => handleDelete(notification)}
        >
          <IconNotifyDelete />
        </Button>
      )}
    </li>
  );
}

export default NotificationListItem;
