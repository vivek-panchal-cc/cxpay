import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import NotificationDropdown from "./notification-dropdown/NotificationDropdown";
import ProfileDropdown from "./profile-dropdown/ProfileDropdown";

const NotificationBar = (props) => {
  const navbarRef = useRef(null);
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "" } = profile || {};

  useEffect(() => {
    if (!navbarRef.current) return;
    const handleScroll = (event) => {
      const body = event.target;
      const bar = navbarRef.current;
      const scrollTop = event.target.scrollTop;
      const elmBottom = bar.offsetTop + bar.clientHeight;
      if (scrollTop > 10) body.classList.add("sticky_appear");
      else body.classList.remove("sticky_appear");
    };
    document.querySelector("body").addEventListener("scroll", handleScroll);
    return () => {
      document
        .querySelector("body")
        .removeEventListener("scroll", handleScroll);
    };
  }, [navbarRef]);

  return (
    <div className={`dashboard-top-sec no-search-ontop`} ref={navbarRef}>
      <div className="dashboard-notification-sec gap-4">
        {user_type !== "agent" && <NotificationDropdown />}
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default NotificationBar;
