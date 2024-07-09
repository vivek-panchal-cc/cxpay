import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  IconInfo,
  IconLock,
  IconNotification,
  IconProfile,
  IconRightArrow,
  IconSetting,
} from "styles/svgs";

const settingsRedirects = [
  {
    icon: <IconNotification />,
    title: "Notifications",
    link: (
      <Link
        to={"/setting/notification"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconLock />,
    title: "Password",
    link: (
      <Link
        to={"/setting/change-password"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconProfile />,
    title: "Profile",
    link: (
      <Link
        to={"/setting/edit-profile"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconInfo />,
    title: "Business info",
    link: (
      <Link
        to={"/setting/business-info"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconSetting style={{ fill: "#ffff" }}/>,
    title: "App Settings",
    link: (
      <Link
        to={"/setting/app-settings"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
];

function Setting() {
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "personal" } = profile || {};

  return (
    <div className="settings-right-sec settings-vc-sec">
      <div className="settings-inner-sec">
        <div className="profile-info">
          <h3>Settings</h3>
        </div>
        <div className="settings-bottom-info-sec">
          <ul>
            {settingsRedirects?.map((item, index) => (
              <React.Fragment key={index}>
                {(item?.title === "Business info" &&
                  user_type === "personal") ||
                (item?.title === "Business info" && user_type === "agent") ||
                (item?.title === "Notifications" && user_type === "agent") ? (
                  ""
                ) : (
                  <li key={item.title?.trim() || index}>
                    <div className="icon-wrap">
                      <span className="icon-settings">{item.icon}</span>
                      {item.title}
                    </div>
                    {item.link}
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Setting;
