import React from "react";
import { IconBin, IconEdit } from "styles/svgs";

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
        <div class="schedule-pay-sd-wrap">
          <button class="shedule-date-filter">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
            >
              <path
                d="M11.8167 4.16667C12.6912 4.16667 13.4001 3.45778 13.4001 2.58333C13.4001 1.70888 12.6912 1 11.8167 1C10.9423 1 10.2334 1.70888 10.2334 2.58333C10.2334 3.45778 10.9423 4.16667 11.8167 4.16667Z"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M13.3916 2.58301H16.0333"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M1.16699 2.58301H10.2337"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M5.58333 9.46647C6.45778 9.46647 7.16667 8.75759 7.16667 7.88314C7.16667 7.00869 6.45778 6.2998 5.58333 6.2998C4.70888 6.2998 4 7.00869 4 7.88314C4 8.75759 4.70888 9.46647 5.58333 9.46647Z"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M7.16699 7.88379H16.0337"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M1.16699 7.88379H4.00866"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M11.8167 14.7663C12.6912 14.7663 13.4001 14.0574 13.4001 13.1829C13.4001 12.3085 12.6912 11.5996 11.8167 11.5996C10.9423 11.5996 10.2334 12.3085 10.2334 13.1829C10.2334 14.0574 10.9423 14.7663 11.8167 14.7663Z"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M13.3916 13.1836H16.0333"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M1.16699 13.1836H10.2337"
                stroke="white"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
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
                  <IconBin style={{ fill: "#FF3333", stroke: "#F3F3F3" }} />
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
