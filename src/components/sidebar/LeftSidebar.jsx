import { fetchLogout } from "features/user/userProfileSlice";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  IconActivity,
  IconContact,
  IconHome,
  IconLogout,
  IconProfileVerified,
  IconRequest,
  IconSend,
  IconSetting,
  IconWallet,
} from "styles/svgs";
// import { deleteCookie } from "shared/cookies";

function LeftSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const thisRoute = useMemo(() => location.pathname.split("/")[1], [location]);

  // this function should be in a common folder
  const handleLogout = async (event) => {
    event.preventDefault();
    await dispatch(fetchLogout());
  };

  return (
    <div className="dashboard-left-wrap">
      <span className="toggle-admin-btn">
        <img
          src="/assets/images/dashaboard-button-toggle.png"
          alt="button dashboard icon"
        />
      </span>
      <div className="dashboard-logo-wrap">
        <Link to="/">
          <img src="/assets/images/dashaboard-logo.png" alt="dashboard logo" />
        </Link>
        <Link to="/" className="dashaboard-btn">
          Business
        </Link>
      </div>
      <div className="dashboard-link-wrap">
        <ul className="dashboard-main-links">
          <li className={`${thisRoute === "dashboard" ? "active" : ""}`}>
            <Link to="/dashboard">
              <IconHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={`${thisRoute === "send" ? "active" : ""}`}>
            <Link to="/">
              <IconSend style={{ stroke: "#F3F3F3" }} />
              <span>Send</span>
            </Link>
          </li>
          <li className={`${thisRoute === "request" ? "active" : ""}`}>
            <Link to="/">
              <IconRequest />
              <span>Request</span>
            </Link>
          </li>
          <li className={`${thisRoute === "activities" ? "active" : ""}`}>
            <Link to="/">
              <IconActivity />
              <span>Activities</span>
            </Link>
          </li>
          <li className={`${thisRoute === "wallet" ? "active" : ""}`}>
            <Link to="/wallet">
              <IconWallet />
              Wallet
            </Link>
          </li>
          <li className={`${thisRoute === "contacts" ? "active" : ""}`}>
            <Link to="/contacts">
              <IconContact style={{ stroke: "#F3F3F3" }} />
              Contacts
            </Link>
          </li>
        </ul>
        <ul className="dashboard-bottom-links">
          <li className={`${thisRoute === "profile" ? "active" : ""}`}>
            <Link to="/">
              <IconProfileVerified />
              Profile
            </Link>
          </li>
          <li className={`${thisRoute === "setting" ? "active" : ""}`}>
            <Link to="/setting">
              <IconSetting style={{ fill: "#fff100" }} />
              Setting
            </Link>
          </li>
          <li className={`${thisRoute === "link-bank" ? "active" : ""}`}>
            <Link to="/link-bank">
              <IconWallet />
              Link Bank
            </Link>
          </li>
          <li>
            <a className="" onClick={handleLogout}>
              <IconLogout style={{ stroke: "#FFF100" }} />
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
