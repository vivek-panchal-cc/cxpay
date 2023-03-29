import NotificationListItem from "components/items/NotificationListItem";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconNotify } from "styles/svgs";

const NotificationDropdown = (props) => {
  const dropdownref = useRef(null);
  const { notifications } = useSelector((state) => state.userNotification);

  return (
    <div className="notification-user-wrap">
      <div className="dashboard-notification-wrap">
        <div className="notification-icon">
          <IconNotify />
          <span className="notification-count">
            <span></span>
          </span>
        </div>
      </div>
      {/* <!-- Notification Dropdown Start --> */}
      <div className="notification-dd-wrap" ref={dropdownref}>
        <ul className="notification-list-wrap">
          {notifications?.map((item, index) => (
            <NotificationListItem
              className="notification-content-wrap"
              notification={item}
              showDeleteButton={false}
              key={index}
            />
          ))}
        </ul>
        {notifications && notifications.length > 0 ? (
          <div className="see-all-notifi">
            <Link to="/view-notification" replace>
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
