import React, { useState } from "react";
import { IconCalender, IconCaretDown, IconQuickInfo } from "styles/svgs";

const RecentActivity = () => {
  const handleChange = async (event) => {
    event.preventDefault();
    setSelected(event.target.value);
  };
  const options = [
    { value: "", text: "Month" },
    { value: "1", text: "Year" },
  ];
  const [selected, setSelected] = useState(options[0].value);
  return (
    <div className="dashboard-recent-activity-sec">
      <div className="recent-activity-sec">
        <div className="title-content-wrap">
          <h3>Recent Activity</h3>
          <form>
            <select
              value={selected}
              onChange={handleChange}
              className="form-select form-control"
              aria-label="Default select example"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>
      {/*  <!-- recent activity section starts --> */}
      <div className="activity-tab-sec">
        <div className="calendar-sec">
          <div
            id="reportrange"
            style={{
              background: "#fff",
              cursor: "pointer",
              padding: "5px 10px; border: 1px solid #ccc",
              width: "100%",
            }}
          >
            <i className="fa fa-calendar">
              <IconCalender />
            </i>
            <span></span>
            <i className="fa fa-caret-down">
              <IconCaretDown />
            </i>
          </div>
        </div>
        <div className="activity-tab-inner">
          <div className="activity-tab-wrap">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="change-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  History
                </button>
                <button
                  className="nav-link"
                  id="forgot-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  Groups
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              {/* <!-- History tab content starts --> */}
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="change-tab"
              >
                <div className="tab-inner-wrap">
                  {/* <!-- tab-content-block-part starts --> */}
                  <div className="tab-content-block-part">
                    <p>September 2022</p>
                    <ul>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image01.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            01 Sep 2022, at 18:00 PM
                          </div>
                          <div className="price-info">+123.45 Nafl</div>
                          <div className="quick-info-btn">
                            <a href="/">
                            <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- tab-content-block-part close --> */}
                  {/* <!-- tab-content-block-part start --> */}
                  <div className="tab-content-block-part">
                    <p>August 2022</p>
                    <ul>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image02.jpg"}
                                alt="userimage"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            28 Aug 2022, at 18:00 PM
                          </div>
                          <div className="price-info">
                            <span className="negative-price">-12.34 Nafl</span>
                          </div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image03.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            20 Aug 2022, at 14:30 PM
                          </div>
                          <div className="price-info">+123.45 Nafl</div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image01.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            07 Aug 2022, at 21:30 PM
                          </div>
                          <div className="price-info">
                            <span className="negative-price">-12.34 Nafl</span>
                          </div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- tab-content-block-part close--> */}
                  <div className="view-history-btn">
                    <a href="/">View all history</a>
                  </div>
                </div>
              </div>
              {/*   <!-- History tab content close --> */}

              {/*  <!-- Group tab content starts --> */}
              <div
                className="tab-pane fade"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="forgot-tab"
              >
                <div className="tab-inner-wrap">
                  {/*   <!-- tab-content-block-part starts --> */}
                  <div className="tab-content-block-part">
                    <p>September 2022</p>
                    <ul>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image02.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            01 Sep 2022, at 18:00 PM
                          </div>
                          <div className="price-info">+123.45 Nafl</div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- tab-content-block-part close -->
                          <!-- tab-content-block-part start --> */}
                  <div className="tab-content-block-part">
                    <p>August 2022</p>
                    <ul>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image03.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            28 Aug 2022, at 18:00 PM
                          </div>
                          <div className="price-info">
                            <span className="negative-price">-12.34 Nafl</span>
                          </div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image01.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            20 Aug 2022, at 14:30 PM
                          </div>
                          <div className="price-info">+123.45 Nafl</div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="user-info">
                          <div className="user-img-title-wrap">
                            <div className="activity-use-img">
                              <img
                                src={"/assets/images/activity-use-image02.jpg"}
                                alt="user img"
                              />
                            </div>
                            <h4>Contact Name</h4>
                          </div>
                          <div className="date-info">
                            07 Aug 2022, at 21:30 PM
                          </div>
                          <div className="price-info">
                            <span className="negative-price">-12.34 Nafl</span>
                          </div>
                          <div className="quick-info-btn">
                            <a href="/">
                              <IconQuickInfo />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- tab-content-block-part close--> */}
                  <div className="view-history-btn">
                    <a href="/">View all history</a>
                  </div>
                </div>
              </div>
              {/*  <!-- Group tab content close --> */}
            </div>
          </div>
        </div>
      </div>
      {/*  <!-- recent activity section close--> */}
    </div>
  );
};

export default RecentActivity;
