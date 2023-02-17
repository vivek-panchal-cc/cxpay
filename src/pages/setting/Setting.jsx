import React from "react";
import { Link } from "react-router-dom";
import {
  IconInfo,
  IconLock,
  IconNotification,
  IconProfile,
  IconRightArrow,
} from "styles/svgs";

const settingsRedirects = [
  {
    icon: <IconNotification />,
    title: "Notification",
    link: (
      <Link to={"/setting/notification"} className="setting-details-links">
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconLock />,
    title: "Password",
    link: (
      <Link to={"/setting/change-password"} className="setting-details-links">
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconProfile />,
    title: "Profile",
    link: (
      <Link to={"/setting/edit-profile"} className="setting-details-links">
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconInfo />,
    title: "Business info",
    link: (
      <Link to={"/setting/business-info"} className="setting-details-links">
        <IconRightArrow />
      </Link>
    ),
  },
];

function Setting() {
  return (
    <div className="settings-right-sec min-vh-100">
      <div className="settings-inner-sec">
        <div className="profile-info">
          <h3>Settings</h3>
          <p>Lorem Ipsum Dolor Sit Amet</p>
        </div>
        <div className="settings-bottom-info-sec">
          <ul>
            {settingsRedirects?.map((item, index) => (
              <li key={index}>
                <div className="icon-wrap">
                  <span className="icon-settings">{item.icon}</span>
                  {item.title}
                </div>
                {item.link}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Setting;
