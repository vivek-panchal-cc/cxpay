import Image from "components/ui/Image";
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
        <div className="user-image-wrap" onClick={() => setShowDrop(true)}>
          <span className="h-100 w-100">
            <Image
              src={profile?.profile_image}
              alt="profile avtars"
              fallbacksrc={
                profile?.user_type === "business"
                  ? "/assets/images/Business-account.png"
                  : "/assets/images/Personal.png"
              }
              className="h-100 w-100 object-fit-cover"
              style={{ objectPosition: "center" }}
            />
          </span>
        </div>
        <ul ref={dropdownref} style={{ display: showDrop ? "block" : "none" }}>
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
      </div>
    </div>
  );
};

export default ProfileDropdown;
