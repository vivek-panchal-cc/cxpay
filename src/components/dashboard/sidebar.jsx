import React from "react";
import {
  IconActivity,
  IconContact,
  IconHome,
  IconProfileVerified,
  IconRequest,
  IconSend,
  IconSetting,
  IconWallet,
} from "styles/svgs";

const Sidebar = () => {
  //   if (!email || !password) {
  //     setError("email and password are required");
  //     setLoading(false);
  //     return;
  //   }
  //   try {
  //     axiosInstance
  //       .post(loginUrl, {
  //         title: "Hello World!",
  //         body: "This is a new post.",
  //       })
  //       .then((response) => {
  //         console.log("response.data :>> ", response.data);
  //       });

  //     // handle successful login
  //   } catch (err) {
  //     setError("Something went wrong. Please try again.");
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="dashboard-link-wrap">
      <ul className="dashboard-main-links">
        <li className="active">
          <a href="/">
            <IconHome />
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/">
            <IconSend style={{ stroke: "#F3F3F3" }} />
            <span>Send</span>
          </a>
        </li>
        <li>
          <a href="/">
            <IconRequest />
            <span>Request</span>
          </a>
        </li>
        <li>
          <a href="/">
            <IconActivity />
            <span>Activities</span>
          </a>
        </li>
        <li>
          <a href="/">
            <IconWallet />
            Wallet
          </a>
        </li>
        <li>
          <a href="/">
            <IconContact style={{ stroke: "#F3F3F3" }} />
            Contacts
          </a>
        </li>
      </ul>
      <ul className="dashboard-bottom-links">
        <li>
          <a href="/">
            <IconProfileVerified />
            Profile
          </a>
        </li>
        <li>
          <a href="/">
            <IconSetting style={{ fill: "#fff100" }} />
            Setting
          </a>
        </li>
        <li>
          <a href="/">
            <IconLogout style={{ stroke: "#FFF100" }} />
            Log out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
