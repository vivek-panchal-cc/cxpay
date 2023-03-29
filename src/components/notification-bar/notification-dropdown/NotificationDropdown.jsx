import NotificationListItem from "components/items/NotificationListItem";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconNotify } from "styles/svgs";

const NotificationDropdown = (props) => {
  const dropdownref = useRef(null);
  const { dropNotifications } = useSelector((state) => state.userNotification);
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
          {dropNotifications?.map((item, index) => (
            <NotificationListItem
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
