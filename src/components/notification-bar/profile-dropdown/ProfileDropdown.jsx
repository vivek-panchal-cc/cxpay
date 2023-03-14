import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IconContact, IconLogout, IconSetting } from "styles/svgs";
import ProfileDropItem from "./ProfileDropItem";

const ProfileDropdown = () => {
  const dropdownref = useRef(null);
  const { profile } = useSelector((state) => state.userProfile);
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

  const profileDropItems = [
    {
      title: "Profile",
      path: "/profile",
      icon: <IconContact style={{ stroke: "#363853" }} />,
    },
    {
      title: "Settings",
      path: "/setting",
      icon: <IconSetting style={{ stroke: "#363853" }} />,
    },
    {
      title: "Logout",
      path: "/logout",
      icon: <IconLogout style={{ stroke: "#363853" }} />,
    },
  ];
  return (
    <div className="user-profile">
      <div className="user-image">
        <div className="user-image-wrap">
          <span className="user-image" onMouseEnter={() => setShowDrop(true)}>
            <img src={profile.profile_image} alt="user img" />
          </span>
        </div>
        {showDrop && (
          <ul ref={dropdownref}>
            {profileDropItems.map((elm, index) => (
              <ProfileDropItem
                path={elm.path}
                key={index}
                onClick={() => setShowDrop(false)}
              >
                {elm.icon}
                {elm.title}
              </ProfileDropItem>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
