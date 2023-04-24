import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "components/dashboard/sidebar.jsx";
import RecentActivity from "components/dashboard/recentActivity";
import RecentContactSlider from "components/dashboard/recentContactSlider";
// import "/assets/images/card-5.png" from "/assets/images/card-5.png";
// import "/assets/images/card-6.png" from "/assets/images/card-6.png";
// import "/assets/images/user-image-logged-in.png" from "/assets/images/user-image-logged-in.png";
// import "/assets/images/dashaboard-button-toggle.png" from "/assets/images/dashaboard-button-toggle.png";
// import "/assets/images/dashaboard-logo.png" from "/assets/images/dashaboard-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie } from "shared/cookies";
import { fetchUserProfile } from "features/user/userProfileSlice";
import {
  IconAdd,
  IconContact,
  IconHexagonProfile,
  IconLogout,
  IconMessage,
  IconNotify,
  IconRightArrowBig,
  IconSearch,
  IconSend,
  IconSetting,
} from "styles/svgs";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await dispatch(fetchUserProfile());
    })();
  }, [dispatch]);

  // this function should be in a common folder
  const handleLogout = (event) => {
    event.preventDefault();
    deleteCookie();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-lg-3 dashboard-left-sec">
            <div className="dashboard-left-wrap">
              <span className="toggle-admin-btn">
                <img
                  src={"/assets/images/dashaboard-button-toggle.png"}
                  alt="button dashboard icon"
                />
              </span>
              <div className="dashboard-logo-wrap">
                <a href="/">
                  <img
                    src={"/assets/images/dashaboard-logo.png"}
                    alt="dashboard logo"
                  />
                </a>
                <a href="/" className="dashaboard-btn">
                  Business
                </a>
              </div>
              <Sidebar />
            </div>
          </div>
          <div className="col-xs-12 col-lg-9 dashboard-right-sec dashaboard-main-sec">
            {/* <!-- dahsboard top sec starts -->	 */}
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
                        {/* <img src={"/assets/images/user-image-logged-in.png"} alt="user img" /> */}
                      </span>
                    </div>
                    <ul>
                      <li>
                        <a href="/">
                          <IconContact style={{ stroke: "#363853" }} />
                          Profile
                        </a>
                      </li>
                      <li>
                        <a href="/">
                          <IconSetting style={{ stroke: "#363853" }} />
                          Settings
                        </a>
                      </li>
                      <li onClick={handleLogout}>
                        <a href="/">
                          <IconLogout style={{ stroke: "#363853" }} />
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- dahsboard top sec close -->   */}
            <div className="dashboard-bottom-sec">
              <div className="dashboard-graph-sec col-lg-7 col-12">
                <div className="graph-title-content-wrap">
                  <div className="title-content-wrap">
                    <h2>Hi, Digicel</h2>
                    <p>
                      Welcome to CXpay Business <a href="/">+ Add Funds</a>
                    </p>
                  </div>
                  <div className="dashboard-graph-wrap">
                    <div
                      id="chartContainer"
                      style={{ height: "370px", width: "100%" }}
                    ></div>
                  </div>
                </div>
                {/* test */}
                <RecentActivity />
              </div>
              {/*   <!-- Dashboard card section starts --> */}
              <div className="dashboard-card-links-sec col-lg-5 col-12">
                <div className="dashboard-card-sec">
                  <div className="title-content-wrap">
                    <h3>Hi, Digicel</h3>
                    <p>
                      8 Cards <a href="/">+ Add Card</a>
                    </p>
                  </div>
                  <div className="card-slider">
                    <div className="swiper">
                      {/* <!-- Additional required wrapper --> */}
                      <div className="swiper-wrapper">
                        {/* <!-- Slides --> */}
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-5.png"}
                            alt="card 5 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-6.png"}
                            alt="card 6 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-5.png"}
                            alt="card 7 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-6.png"}
                            alt="card 8 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-5.png"}
                            alt="card 1 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-6.png"}
                            alt="card 2 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-5.png"}
                            alt="card 3 img"
                          />
                        </div>
                        <div className="swiper-slide">
                          <img
                            src={"/assets/images/card-6.png"}
                            alt="card 4 img"
                          />
                        </div>
                      </div>
                      {/*  <!-- If we need pagination --> */}
                      <div className="swiper-pagination"></div>

                      {/*  <!-- If we need navigation buttons --> */}
                      <div className="swiper-button-prev"></div>
                      <div className="swiper-button-next"></div>

                      {/*  <!-- If we need scrollbar --> */}
                      <div className="swiper-scrollbar"></div>
                    </div>
                  </div>
                </div>
                {/* <!-- Dashboard recent contacts section starts --> */}
                <div className="dashboard-recent-contact-sec">
                  <div className="recent-contact-sec">
                    <div className="title-content-wrap">
                      <h3>Recent Contact</h3>
                      <form>
                        <div className="form-field search-field">
                          <input
                            type="search"
                            className="form-control"
                            name="search-field"
                            placeholder="Search..."
                          />
                          <button type="button" className="search-btn">
                            <IconSearch />
                          </button>
                        </div>
                      </form>
                    </div>

                    <RecentContactSlider />
                  </div>
                </div>
                {/* <!-- Dashboard recent contacts section close -->
				
				<!-- Dashboard extra links section starts -->	 */}
                <div className="extra-links-wrap">
                  <ul>
                    <li>
                      <a href="/">
                        <span className="icon-link-text">
                          <IconAdd />
                          Fund Your Account
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon-link-text">
                          <IconHexagonProfile />
                          Invite a Contact
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon-link-text">
                          <IconSend style={{ stroke: "#363853" }} />
                          Send
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon-link-text">
                          <IconAdd />
                          Add a Contact
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon-link-text">
                          <IconMessage />
                          Group Payment
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* <!-- Dashboard extra links section close -->  */}
              </div>
            </div>
            {/* <!-- dahsboard top sec close -->
         </div>		  */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
