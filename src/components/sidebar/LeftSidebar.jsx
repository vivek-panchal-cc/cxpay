import { fetchLogout } from "features/user/userProfileSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
          <li className="active">
            <Link to="/dashboard">
              <IconHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <IconSend style={{ stroke: "#F3F3F3" }} />
              <span>Send</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <IconRequest />
              <span>Request</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <IconActivity />
              <span>Activities</span>
            </Link>
          </li>
          <li>
            <Link to="/wallet">
              <IconWallet />
              Wallet
            </Link>
          </li>
          <li>
            <Link to="/">
              <IconContact style={{ stroke: "#F3F3F3" }} />
              Contacts
            </Link>
          </li>
        </ul>
        <ul className="dashboard-bottom-links">
          <li>
            <Link to="/">
              <IconProfileVerified />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/setting">
              <IconSetting style={{ fill: "#fff100" }} />
              Setting
            </Link>
          </li>
          <li>
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
