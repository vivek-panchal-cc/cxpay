import React from 'react';
import { IconNotify } from 'styles/svgs';

const NotificationDropdown = () => {
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
      </div>
    );
}

export default NotificationDropdown;
