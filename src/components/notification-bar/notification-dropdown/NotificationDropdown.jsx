import NotificationListItem from "components/items/NotificationListItem";
import { notificationType } from "constants/all";
import LoaderNotificationDropdown from "loaders/LoaderNotificationDropdown";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconNotify } from "styles/svgs";

const NotificationDropdown = (props) => {
  const dropdownref = useRef(null);
  const { dropNotifications, initialLoading } = useSelector(
    (state) => state.userNotification
  );
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {
    function handleclickOutside(event) {
      if (dropdownref.current && !dropdownref.current.contains(event.target)) {
        setShowDrop(false);
      }
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [dropdownref]);

  return (
    <div className="notification-user-wrap">
      <div
        className="dashboard-notification-wrap"
        onClick={() => setShowDrop(true)}
      >
        <div className="notification-icon">
          <IconNotify />
          <span className="notification-count">
            <span></span>
          </span>
        </div>
      </div>
      {/* <!-- Notification Dropdown Start --> */}
      <div
        className="notification-dd-wrap"
        style={{ display: showDrop ? "block" : "none" }}
        ref={dropdownref}
      >
        <ul className="notification-list-wrap">
          {initialLoading
            ? [1, 2, 3, 4, 5].map((item) => (
                <LoaderNotificationDropdown key={item} />
              ))
            : dropNotifications?.map((item, index) => (
                <NotificationListItem
                  Icon={notificationType[item?.type]?.icon}
                  className="notification-content-wrap"
                  notification={item}
                  showDeleteButton={false}
                  key={index}
                />
              ))}
        </ul>
        {dropNotifications && dropNotifications.length > 0 ? (
          <div className="see-all-notifi">
            <Link
              to="/view-notification"
              replace={true}
              onClick={() => setShowDrop(false)}
            >
              See All
            </Link>
          </div>
        ) : (
          <div className="see-all-notifi">
            <p>No Notifications Yet</p>
          </div>
        )}
      </div>
      {/* <!-- Notification Dropdown End --> */}
    </div>
  );
};

export default NotificationDropdown;
