import React from "react";
import userImage from "assets/images/user-image-logged-in.png";
import { IconContact, IconLogout, IconNotify, IconSearch, IconSetting } from "styles/svgs";
// import { deleteCookie } from "shared/cookies";

const dashboardTopSec = () => {
  return (
    <div className="dashboard-top-sec">
      <div className="dashboard-search-wrap col-lg-7 col-12">
        <form>
          <div className="form-field search-field">
            <input
              type="search"
              className="form-control"
              name="search-field"
              placeholder="Search..."
            />
            <div className="search-btn">
              <IconSearch />
            </div>
          </div>
        </form>
      </div>
      <div className="dashboard-notification-sec col-lg-5 col-12">
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
        <div className="user-profile">
          <div className="user-image">
            <div className="user-image-wrap">
              <span className="user-image">
                <img src={userImage} alt="user img" />
              </span>
            </div>
            <ul>
              <li>
                <a href="/">
                  <IconContact style={{stroke: '#363853'}}/>
                  Profile
                </a>
              </li>
              <li>
                <a href="/">
                  <IconSetting style={{fill: "#363853"}} />
                  Settings
                </a>
              </li>
              <li onClick={()=>{}}>
                <a href="/">
                  <IconLogout style={{stroke: '#363853'}}/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default dashboardTopSec;
