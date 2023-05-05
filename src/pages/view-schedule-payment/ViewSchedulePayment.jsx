import React from "react";

const ViewSchedulePayment = () => {
  return (
    <>
      <div class="activities-sec">
        <div className="col-12 send-payment-ttile-wrap">
          <div className="title-content-wrap send-pay-title-sec">
            <h3>My Schedule Payment</h3>
            <p>Please select payment date</p>
          </div>
        </div>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist"></div>
        </nav>
        <div class="activity-user-list-wrap">
          <div class="activity-month">September 2022</div>
          <ul className="act-user-content-wrap">
            <li>
              <div className="left-activity-div">
                <div className="user-thumb-name">
                  <img src="/assets/images/single_contact_profile.png" alt="" />
                  <span>Contact Name </span>
                </div>
                <div className="activity-date">01 Sep 2022, at 18:00 PM</div>
                <div className="act-spec-add">
                  Description will be written here
                </div>
                <div className="seleted-value green">+123.45 Nafl</div>
              </div>
              <div className="right-activity-div">
                <button className="act-edit-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <rect width="33" height="32" rx="8" fill="#24BEEF" />
                    <path
                      d="M16.6191 23.4941H24.2381"
                      stroke="#F3F3F3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20.4285 9.52598C20.7653 9.1892 21.222 9 21.6983 9C21.9341 9 22.1677 9.04645 22.3855 9.1367C22.6034 9.22695 22.8014 9.35922 22.9681 9.52598C23.1349 9.69274 23.2672 9.89071 23.3574 10.1086C23.4477 10.3265 23.4941 10.56 23.4941 10.7958C23.4941 11.0316 23.4477 11.2652 23.3574 11.483C23.2672 11.7009 23.1349 11.8989 22.9681 12.0656L12.3862 22.6476L9 23.4941L9.84655 20.1079L20.4285 9.52598Z"
                      stroke="#F3F3F3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button className="act-del-wrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M0 8C0 3.58172 3.58172 0 8 0H25C29.4183 0 33 3.58172 33 8V24C33 28.4183 29.4183 32 25 32H8C3.58172 32 0 28.4183 0 24V8Z"
                      fill="#FF3333"
                    />
                    <path
                      d="M8 10.5996H9.8H24.2"
                      stroke="#F3F3F3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22.3998 10.6V23.2C22.3998 23.6774 22.2102 24.1352 21.8726 24.4728C21.535 24.8104 21.0772 25 20.5998 25H11.5998C11.1224 25 10.6646 24.8104 10.327 24.4728C9.98945 24.1352 9.7998 23.6774 9.7998 23.2V10.6M12.4998 10.6V8.8C12.4998 8.32261 12.6894 7.86477 13.027 7.52721C13.3646 7.18964 13.8224 7 14.2998 7H17.8998C18.3772 7 18.835 7.18964 19.1726 7.52721C19.5102 7.86477 19.6998 8.32261 19.6998 8.8V10.6"
                      stroke="#F3F3F3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.2998 15.0996V20.4996"
                      stroke="#F3F3F3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.8999 15.0996V20.4996"
                      stroke="#F3F3F3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ViewSchedulePayment;
