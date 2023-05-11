import { apiRequest } from "helpers/apiRequests";
import React from "react";
import { useEffect } from "react";
import { IconBin, IconEdit } from "styles/svgs";

const ViewSchedulePayment = () => {
  const retrieveSchedulePayments = async () => {
    try {
      const { data } = await apiRequest.listSchedulePayment();
      if (!data.success) throw data.message;
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    retrieveSchedulePayments();
  }, []);

  return (
    <>
      <div className="activities-sec">
        <div className="col-12 send-payment-ttile-wrap">
          <div className="title-content-wrap send-pay-title-sec">
            <h3>My Schedule Payment</h3>
            <p>Please select payment date</p>
          </div>
        </div>
        <div className="schedule-pay-sd-wrap">
          <button className="shedule-date-filter">
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
        <div className="activity-user-list-wrap">
          <div className="activity-month">September 2022</div>
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
                <button
                  className="act-edit-wrap rounded"
                  style={{
                    background: "#0081C5",
                    width: "33px",
                    height: "32px",
                  }}
                >
                  <IconEdit style={{ stroke: "#FFF" }} />
                </button>
                <button
                  className="act-del-wrap rounded"
                  style={{ background: "#FF3333" }}
                >
                  <IconBin style={{ stroke: "#F3F3F3" }} />
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
