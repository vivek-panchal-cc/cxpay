import { fetchLogout } from "features/user/userProfileSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IconActivity, IconContact, IconHome, IconLogout, IconProfileVerified, IconRequest, IconSend, IconSetting, IconWallet } from "styles/svgs";
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
        <a href="#">
          <img src="/assets/images/dashaboard-logo.png" alt="dashboard logo" />
        </a>
        <a href="#" className="dashaboard-btn">
          Business
        </a>
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
              <IconSend />
              <span>Send</span>
            </Link>
          </li>
          <li>
            <a href="#">
              <IconRequest />
              <span>Request</span>
            </a>
          </li>
          <li>
            <a href="#">
              <IconActivity />
              <span>Activities</span>
            </a>
          </li>
          <li>
            <a href="#">
              <IconWallet />
              Wallet
            </a>
          </li>
          <li>
            <a href="#">
              <IconContact style={{stroke: '#F3F3F3'}}/>
              Contacts
            </a>
          </li>
        </ul>
        <ul className="dashboard-bottom-links">
          <li>
            <a href="#">
              <IconProfileVerified />
              Profile
            </a>
          </li>
          <li>
            <a href="/setting">
              <IconSetting style={{fill: "#fff100"}}/>
              Setting
            </a>
          </li>
          <li>
            <a href="/link-bank">
              {" "}
              <IconWallet />
              Link Bank
            </a>
          </li>
          <li>
            <a className="" onClick={handleLogout}>
              <IconLogout style={{stroke: "#FFF100"}} />
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
