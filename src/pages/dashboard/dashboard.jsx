import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "assets/css/bootstrap.min.css";
// import "assets/css/style.css";
// import "assets/css/responsive.css";
// import canvasjs from "assets/js/bootstrap.min.js";
import { loginUrl } from "constants/urls.js";
import { axiosInstance } from "plugin/axios.js";
import Sidebar from "components/dashboard/sidebar.jsx";
import RecentActivity from "components/dashboard/recentActivity";
import RecentContactSlider from "components/dashboard/recentContactSlider";
import recentContactImg01 from "assets/images/recent-contact-img01.png";
import recentContactImg02 from "assets/images/recent-contact-img02.png";
import card5 from "assets/images/card-5.png";
import card6 from "assets/images/card-6.png";
import userImage from "assets/images/user-image-logged-in.png";
import buttonToggle from "assets/images/dashaboard-button-toggle.png";
import dashboardLogo from "assets/images/dashaboard-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie } from "shared/cookies";
import { userProfileApi } from "apiService/dashboard";
import * as userAction from "store/actions/userAction";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserProfile = async () => {
    const response = await userProfileApi();
    setUserProfile(response.data);
    // move dispatch function in apiService folder
    dispatch(userAction.userProfileAction(response.data));
  };

  useEffect(() => {
   console.log('useEffect')
    getUserProfile();
  }, []);

  const test = useSelector((state) => state.userProfile);
  console.log("test dashboard :>> ", test);
  console.log("userProfile :>> ", userProfile);
  
// this function should be in a common folder
  const handleLogout = async (event) => {
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
                <img src={buttonToggle} alt="button dashboard icon" />
              </span>
              <div className="dashboard-logo-wrap">
                <a href="#">
                  <img src={dashboardLogo} alt="dashboard logo" />
                </a>
                <a href="#" className="dashaboard-btn">
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
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.94288 13.4033C10.9586 13.4033 13.4033 10.9586 13.4033 7.94288C13.4033 4.92715 10.9586 2.48242 7.94288 2.48242C4.92715 2.48242 2.48242 4.92715 2.48242 7.94288C2.48242 10.9586 4.92715 13.4033 7.94288 13.4033Z"
                          stroke="#969696"
                          strokeWidth="0.975"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.8071 11.8066L15.0005 15"
                          stroke="#969696"
                          strokeWidth="0.975"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </form>
              </div>
              <div className="dashboard-notification-sec col-lg-5 col-12">
                <div className="notification-user-wrap">
                  <div className="dashboard-notification-wrap">
                    <div className="notification-icon">
                      <svg
                        width="21"
                        height="22"
                        viewBox="0 0 21 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.5303 16.3801H3.80029V8.4701C3.80029 4.6801 6.87029 1.6001 10.6703 1.6001C14.4603 1.6001 17.5403 4.6701 17.5403 8.4701V16.3801H17.5303Z"
                          stroke="#969696"
                          strokeWidth="1.3"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.6001 16.3801H19.7301"
                          stroke="#969696"
                          strokeWidth="1.3"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.6801 18.3701C12.6801 19.4801 11.7801 20.3901 10.6601 20.3901C9.54014 20.3901 8.64014 19.4901 8.64014 18.3701"
                          stroke="#969696"
                          strokeWidth="1.3"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
                        <img src={userImage} alt="user image" />
                      </span>
                    </div>
                    <ul>
                      <li>
                        <a href="#">
                          <svg
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.02072 8.55317C11.1065 8.55317 12.7973 6.86233 12.7973 4.77658C12.7973 2.69083 11.1065 1 9.02072 1C6.93498 1 5.24414 2.69083 5.24414 4.77658C5.24414 6.86233 6.93498 8.55317 9.02072 8.55317Z"
                              stroke="#363853"
                              strokeWidth="1.29114"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.9606 18.0001C16.6708 18.0001 17.2195 17.3115 16.9935 16.6229C15.9068 13.2551 12.7543 10.8127 9.02075 10.8127C5.28721 10.8127 2.13467 13.2551 1.04796 16.6229C0.832774 17.3007 1.37075 18.0001 2.08088 18.0001H15.9606Z"
                              stroke="#363853"
                              strokeWidth="1.29114"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Profile
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.9635 16.4885L12.6638 15.9687L12.9635 16.4885ZM10.0489 17.8924L9.92389 17.3055L10.0489 17.8924ZM5.09207 16.4885L4.79236 17.0082H4.79236L5.09207 16.4885ZM8.00663 17.8924L8.13167 17.3055L8.00663 17.8924ZM16.8529 12.5678L16.2761 12.4028L16.8529 12.5678ZM13.1198 16.3983L13.4196 16.9181L13.1198 16.3983ZM15.6289 14.7132L15.1943 14.2995L15.6289 14.7132ZM13.1198 2.6017L13.4196 2.08192V2.08192L13.1198 2.6017ZM15.6289 4.28676L15.1943 4.70048L15.6289 4.28676ZM16.8529 6.4322L16.2761 6.59718L16.8529 6.4322ZM5.09207 2.51154L4.79236 1.99175V1.99175L5.09207 2.51154ZM8.00663 1.10765L8.13167 1.69447L8.00663 1.10765ZM12.9635 2.51154L12.6638 3.03132V3.03132L12.9635 2.51154ZM10.0489 1.10765L9.92388 1.69447L10.0489 1.10765ZM1 9.5H0.4H1ZM1.20263 6.4322L1.7795 6.59718L1.20263 6.4322ZM4.93571 2.6017L5.23542 3.12148H5.23542L4.93571 2.6017ZM2.42668 4.28676L1.99213 3.87303L2.42668 4.28676ZM1.20263 12.5678L0.625756 12.7328L1.20263 12.5678ZM4.93571 16.3983L5.23542 15.8785L5.23542 15.8785L4.93571 16.3983ZM2.42668 14.7132L1.99213 15.127L2.42668 14.7132ZM5.23542 3.12148L5.39178 3.03132L4.79236 1.99175L4.636 2.08192L5.23542 3.12148ZM12.6638 3.03132L12.8201 3.12148L13.4196 2.08192L13.2632 1.99176L12.6638 3.03132ZM12.8201 15.8785L12.6638 15.9687L13.2632 17.0082L13.4196 16.9181L12.8201 15.8785ZM5.39179 15.9687L5.23542 15.8785L4.636 16.9181L4.79236 17.0082L5.39179 15.9687ZM12.6638 15.9687C11.1931 16.8167 10.5704 17.1678 9.92389 17.3055L10.174 18.4792C11.0497 18.2926 11.8626 17.8158 13.2632 17.0082L12.6638 15.9687ZM4.79236 17.0082C6.19293 17.8158 7.00582 18.2926 7.88158 18.4792L8.13167 17.3055C7.4852 17.1678 6.86247 16.8167 5.39179 15.9687L4.79236 17.0082ZM9.92389 17.3055C9.33276 17.4315 8.7228 17.4315 8.13167 17.3055L7.88158 18.4792C8.63759 18.6403 9.41797 18.6403 10.174 18.4792L9.92389 17.3055ZM16.4556 9.5C16.4556 11.1087 16.4501 11.7944 16.2761 12.4028L17.4298 12.7328C17.6611 11.9241 17.6556 11.037 17.6556 9.5H16.4556ZM13.4196 16.9181C14.7252 16.1652 15.4864 15.733 16.0634 15.127L15.1943 14.2995C14.7651 14.7503 14.1891 15.0892 12.8201 15.8785L13.4196 16.9181ZM16.2761 12.4028C16.0716 13.1176 15.6998 13.7686 15.1943 14.2995L16.0634 15.127C16.7039 14.4542 17.1726 13.632 17.4298 12.7328L16.2761 12.4028ZM12.8201 3.12148C14.1891 3.91081 14.7651 4.24969 15.1943 4.70048L16.0634 3.87303C15.4864 3.26701 14.7252 2.83479 13.4196 2.08192L12.8201 3.12148ZM17.6556 9.5C17.6556 7.96302 17.6611 7.07587 17.4298 6.26722L16.2761 6.59718C16.4501 7.20561 16.4556 7.8913 16.4556 9.5H17.6556ZM15.1943 4.70048C15.6998 5.23136 16.0716 5.88242 16.2761 6.59718L17.4298 6.26722C17.1726 5.36804 16.7039 4.54578 16.0634 3.87303L15.1943 4.70048ZM5.39178 3.03132C6.86247 2.1833 7.4852 1.83223 8.13167 1.69447L7.88158 0.520823C7.00582 0.707439 6.19293 1.18417 4.79236 1.99175L5.39178 3.03132ZM13.2632 1.99176C11.8626 1.18417 11.0497 0.707439 10.174 0.520823L9.92388 1.69447C10.5704 1.83223 11.1931 2.1833 12.6638 3.03132L13.2632 1.99176ZM8.13167 1.69447C8.7228 1.56851 9.33275 1.56851 9.92388 1.69447L10.174 0.520823C9.41797 0.359726 8.63759 0.359726 7.88158 0.520823L8.13167 1.69447ZM1.6 9.5C1.6 7.8913 1.6055 7.20561 1.7795 6.59718L0.625755 6.26722C0.394497 7.07587 0.4 7.96302 0.4 9.5H1.6ZM4.636 2.08191C3.33032 2.83479 2.56911 3.26701 1.99213 3.87303L2.86122 4.70048C3.29041 4.24969 3.86651 3.91081 5.23542 3.12148L4.636 2.08191ZM1.7795 6.59718C1.98391 5.88242 2.35578 5.23136 2.86122 4.70048L1.99213 3.87303C1.35161 4.54578 0.882908 5.36803 0.625755 6.26722L1.7795 6.59718ZM0.4 9.5C0.4 11.037 0.394498 11.9241 0.625756 12.7328L1.7795 12.4028C1.6055 11.7944 1.6 11.1087 1.6 9.5H0.4ZM5.23542 15.8785C3.86651 15.0892 3.29041 14.7503 2.86122 14.2995L1.99213 15.127C2.56911 15.733 3.33032 16.1652 4.636 16.9181L5.23542 15.8785ZM0.625756 12.7328C0.882909 13.632 1.35161 14.4542 1.99213 15.127L2.86122 14.2995C2.35578 13.7686 1.98391 13.1176 1.7795 12.4028L0.625756 12.7328ZM9.02778 11.4716C7.98757 11.4716 7.1191 10.603 7.1191 9.5H5.9191C5.9191 11.2375 7.29697 12.6716 9.02778 12.6716V11.4716ZM10.9365 9.5C10.9365 10.603 10.068 11.4716 9.02778 11.4716V12.6716C10.7586 12.6716 12.1365 11.2375 12.1365 9.5H10.9365ZM9.02778 7.52838C10.068 7.52838 10.9365 8.397 10.9365 9.5H12.1365C12.1365 7.76246 10.7586 6.32838 9.02778 6.32838V7.52838ZM9.02778 6.32838C7.29697 6.32838 5.9191 7.76246 5.9191 9.5H7.1191C7.1191 8.397 7.98757 7.52838 9.02778 7.52838V6.32838Z"
                              fill="#363853"
                            />
                          </svg>
                          Settings
                        </a>
                      </li>
                      <li onClick={handleLogout}>
                        <a href="#">
                          <svg
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18.9485 9.61107H7.88379"
                              stroke="#363853"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.2593 6.9314L18.9499 9.61096L16.2593 12.2905"
                              stroke="#363853"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13.9575 5.48432C13.6543 2.19459 12.4229 1 7.52509 1C0.999843 1 0.999843 3.1227 0.999843 9.5C0.999843 15.8773 0.999843 18 7.52509 18C12.4229 18 13.6543 16.8054 13.9575 13.5157"
                              stroke="#363853"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
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
                      Welcome to CXpay Business <a href="#">+ Add Funds</a>
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
                      8 Cards <a href="#">+ Add Card</a>
                    </p>
                  </div>
                  <div className="card-slider">
                    <div className="swiper">
                      {/* <!-- Additional required wrapper --> */}
                      <div className="swiper-wrapper">
                        {/* <!-- Slides --> */}
                        <div className="swiper-slide">
                          <img src={card5} alt="card 5 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card6} alt="card 6 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card5} alt="card 7 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card6} alt="card 8 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card5} alt="card 1 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card6} alt="card 2 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card5} alt="card 3 image" />
                        </div>
                        <div className="swiper-slide">
                          <img src={card6} alt="card 4 image" />
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
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 19 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.59066 15.871C12.6116 15.871 15.8713 12.6114 15.8713 8.59042C15.8713 4.56945 12.6116 1.30981 8.59066 1.30981C4.5697 1.30981 1.31006 4.56945 1.31006 8.59042C1.31006 12.6114 4.5697 15.871 8.59066 15.871Z"
                                stroke="#969696"
                                strokeWidth="1.3"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M13.7427 13.7422L18.0004 18"
                                stroke="#969696"
                                strokeWidth="1.3"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
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
                      <a href="#">
                        <span className="icon-link-text">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9.35"
                              strokeWidth="1.3"
                              stroke="#363853"
                            />
                            <rect
                              x="11.2998"
                              y="6"
                              width="1.3"
                              height="12"
                              rx="0.65"
                              fill="#363853"
                            />
                            <rect
                              x="18"
                              y="11.3"
                              width="1.3"
                              height="12"
                              rx="0.65"
                              transform="rotate(90 18 11.3)"
                              fill="#363853"
                            />
                          </svg>
                          Fund Your Account
                        </span>
                        <span className="arrow-wrap">
                          <svg
                            width="9"
                            height="16"
                            viewBox="0 0 9 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.3335 1.33341L8.00016 8.00008L1.3335 14.6667"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#363853"
                            />
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon-link-text">
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.34427 18.2321C3.86815 17.381 3.13009 16.9554 2.57478 16.3721C1.94232 15.7078 1.4784 14.8947 1.22366 14.004C1 13.2219 1 12.3538 1 10.6177C1 8.8816 1 8.01354 1.22366 7.23146C1.4784 6.34071 1.94232 5.52759 2.57478 4.8633C3.13009 4.28004 3.86815 3.85447 5.34427 3.00332L5.51686 2.9038C7.10151 1.99006 7.89384 1.5332 8.73397 1.35417C9.47746 1.19574 10.2448 1.19574 10.9883 1.35417C11.8284 1.5332 12.6207 1.99006 14.2054 2.9038L14.378 3.00332C15.8541 3.85447 16.5922 4.28004 17.1475 4.8633C17.7799 5.52759 18.2438 6.34071 18.4986 7.23146C18.7222 8.01354 18.7222 8.8816 18.7222 10.6177C18.7222 12.3538 18.7222 13.2219 18.4986 14.004C18.2438 14.8947 17.7799 15.7078 17.1475 16.3721C16.5922 16.9554 15.8541 17.381 14.378 18.2321L14.2054 18.3316C12.6207 19.2454 11.8284 19.7022 10.9883 19.8813C10.2448 20.0397 9.47746 20.0397 8.73397 19.8813C7.89384 19.7022 7.10152 19.2454 5.51686 18.3316L5.34427 18.2321Z"
                              stroke="#363853"
                              strokeWidth="1.3"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.16992 17.3705C5.16992 15.892 7.31706 14.5271 9.8611 14.5271C12.3914 14.5271 14.5523 15.8788 14.5523 17.3573"
                              stroke="#363853"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.86119 12.1814C11.5884 12.1814 12.9883 10.7815 12.9883 9.05429C12.9883 7.32708 11.5884 5.92651 9.86119 5.92651C8.13398 5.92651 6.73342 7.32708 6.73342 9.05429C6.72758 10.7757 8.11778 12.1756 9.83915 12.1814C9.84693 12.1814 9.85406 12.1814 9.86119 12.1814Z"
                              stroke="#363853"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Invite a Contact
                        </span>
                        <span className="arrow-wrap">
                          <svg
                            width="9"
                            height="16"
                            viewBox="0 0 9 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.3335 1.33341L8.00016 8.00008L1.3335 14.6667"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#363853"
                            />
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon-link-text">
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.87849 9.73485C8.87849 9.73485 -1.97567 7.48946 1.79621 5.31208C4.97919 3.47479 15.9487 0.315913 17.4812 1.13211C18.2974 2.66462 15.1386 13.6342 13.3013 16.8171C11.1239 20.589 8.87849 9.73485 8.87849 9.73485Z"
                              stroke="#363853"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.87842 9.73483L17.4812 1.13208"
                              stroke="#363853"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Send
                        </span>
                        <span className="arrow-wrap">
                          <svg
                            width="9"
                            height="16"
                            viewBox="0 0 9 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.3335 1.33341L8.00016 8.00008L1.3335 14.6667"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#363853"
                            />
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon-link-text">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9.35"
                              strokeWidth="1.3"
                              stroke="#363853"
                            />
                            <rect
                              x="11.2998"
                              y="6"
                              width="1.3"
                              height="12"
                              rx="0.65"
                              fill="#363853"
                            />
                            <rect
                              x="18"
                              y="11.3"
                              width="1.3"
                              height="12"
                              rx="0.65"
                              transform="rotate(90 18 11.3)"
                              fill="#363853"
                            />
                          </svg>
                          Add a Contact
                        </span>
                        <span className="arrow-wrap">
                          <svg
                            width="9"
                            height="16"
                            viewBox="0 0 9 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.3335 1.33341L8.00016 8.00008L1.3335 14.6667"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#363853"
                            />
                          </svg>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon-link-text">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.50194 7.05793H12.8884M6.50194 10.5141H10.5661M11.1761 16.9268H12.2999C15.3564 16.9268 18.0154 14.8499 18.7328 11.9021C19.0891 10.4382 19.0891 8.91126 18.7328 7.44741L18.6387 7.06088C17.9472 4.21958 15.6933 2.01204 12.8209 1.36264L12.4173 1.27141C10.8166 0.909529 9.15434 0.909529 7.55362 1.27141L7.31745 1.32481C4.34246 1.99738 2.00813 4.28371 1.29193 7.22642C0.900312 8.83551 0.90389 10.5287 1.29551 12.1378C2.0229 15.1265 4.16258 17.6138 7.03293 18.7728L7.15805 18.8233C8.40016 19.3248 9.82306 18.7208 10.3327 17.4902C10.473 17.1515 10.807 16.9268 11.1761 16.9268Z"
                              stroke="#363853"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                            />
                          </svg>
                          Group Payment
                        </span>
                        <span className="arrow-wrap">
                          <svg
                            width="9"
                            height="16"
                            viewBox="0 0 9 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.3335 1.33341L8.00016 8.00008L1.3335 14.6667"
                              strokeWidth="2"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#363853"
                            />
                          </svg>
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
