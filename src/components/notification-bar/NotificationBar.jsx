import React, { useEffect, useRef } from "react";
import NotificationDropdown from "./notification-dropdown/NotificationDropdown";
import ProfileDropdown from "./profile-dropdown/ProfileDropdown";

const NotificationBar = (props) => {
  const { issearchbarvisible = false } = props;
  const navbarRef = useRef(null);

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
      {/* {issearchbarvisible && <div className="dashboard-search-wrap">
                    <form>  
                    <div className="form-field search-field">
                        <input type="search" className="form-control" name="search-field" placeholder="Search..." />
                        <div className="search-btn">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.94288 13.4033C10.9586 13.4033 13.4033 10.9586 13.4033 7.94288C13.4033 4.92715 10.9586 2.48242 7.94288 2.48242C4.92715 2.48242 2.48242 4.92715 2.48242 7.94288C2.48242 10.9586 4.92715 13.4033 7.94288 13.4033Z" stroke="#969696" strokeWidth="0.975" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M11.8071 11.8066L15.0005 15" stroke="#969696" strokeWidth="0.975" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            </div>
                            </div>						
                            </form>
                          </div>} */}
      <div className="dashboard-notification-sec gap-4">
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default NotificationBar;
