import Button from "components/ui/Button";
import { timeStampToTimeString } from "helpers/commonHelpers";
import React from "react";
import { IconNotifyDelete } from "styles/svgs";

function NotificationListItem(props) {
  const {
    showDeleteButton,
    handleDelete,
    handleRead,
    notification,
    className,
    Icon,
    timeStampDirection = "UP" | "DOWN",
  } = props;
  const { id, message, status, time } = notification || {};

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
            {timeStampDirection === "UP" && (
              <span class="text-start noti-time">{time}</span>
            )}
            {timeStampDirection === "DOWN" && (
              <span class="text-end noti-time">{time}</span>
            )}
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
