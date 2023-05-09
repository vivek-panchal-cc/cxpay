import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import {
  IconActReqCancel,
  IconActReqDecline,
  IconActReqReceive,
  IconActReqSent,
  IconCalender,
  IconEyeOpen,
} from "styles/svgs";
import ActivityItem from "components/items/ActivityItem";
import Modal from "components/modals/Modal";
import ReactDatePicker from "react-datepicker";
import ModalActivityDetail from "components/modals/ModalActivityDetail";
import { toast } from "react-toastify";
import { SendPaymentContext } from "context/sendPaymentContext";

const Activities = () => {
  const { handleSendContacts } = useContext(SendPaymentContext);
  const [activitiesList, setActivitiesList] = useState([]);
  const [actPagination, setActPagination] = useState({});
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    search: "",
  });
  const [activityDetails, setActivityDetails] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getActivitiesList = async () => {
    try {
      const { data } = await apiRequest.activityList();
      if (!data.success) throw data.message;
      console.log(data);
      const { request_payments, pagination } = data.data || {};
      setActivitiesList(request_payments);
      setActPagination(pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDateFilter = (dates) => {
    const [start, end] = dates;
    setFilters((e) => ({ ...e, startDate: start, endDate: end }));
  };

  const handleActivityDetail = async (actId) => {
    if (!actId) return;
    try {
      const { data } = await apiRequest.getActivityDetails({
        request_payment_id: actId,
      });
      if (!data.success) throw data.message;
      setActivityDetails(data?.data);
      setShowDetails(true);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    }
  };

  const handleActivityDiscard = (actDetails) => {
    const { request_type, status } = actDetails || {};
    switch (`${request_type}_${status}`) {
      case "send_PENDING":
        return <></>;
      case "send_PENDING":
        return <></>;
    }
  };

  const handleActivityRespond = (actDetails) => {
    const { request_type, status } = actDetails || {};
    switch (`${request_type}_${status}`) {
      case "receive_PENDING":
        handleSendContacts(
          [
            {
              account_number: "020000000019",
              country_code: "5999",
              mobile: "8181812",
              email: "ervwervwe23r@cerv.vom",
              status: 1,
              is_favourite: true,
              name: "John Wick",
              profile_image: "",
              personal_amount: 120.11,
              specifications: "la li la lo",
            },
          ],
          [],
          94
        );
        return <></>;
    }
  };

  useEffect(() => {
    getActivitiesList();
  }, []);

  return (
    <div class="activities-sec">
      <div class="activities-top-sec">
        <div class="title-content-wrap">
          {/* <!--<div>In-line mode: <input id="date-range12" size="40" value=""></div>
							 	 Date: <div id="dr-picker"></div> --> */}
          <h3>Activities</h3>
          <p>Lorem Ipsum Dolor Sit Amet</p>
        </div>
      </div>
      <div class="activity-date-wrap date-wrap d-flex align-items-center">
        <div class="date-main-div d-flex">
          <div class="date-inner-div">
            <form>
              <input
                id="from-date"
                type="text"
                className="form-control"
                placeholder="From"
                readonly
                value={filters?.startDate?.toLocaleDateString()}
                onClick={() => setShowFilter(true)}
              />
              <span class="date-cal">
                <IconCalender style={{ stroke: "#0081C5" }} />
              </span>
            </form>
          </div>
          <div class="date-inner-div">
            <form>
              <input
                id="date-end-range"
                type="text"
                className="form-control"
                placeholder="To"
                readonly
                value={filters?.endDate?.toLocaleDateString()}
                onClick={() => setShowFilter(true)}
              />
              <span class="date-cal">
                <IconCalender style={{ stroke: "#0081C5" }} />
              </span>
            </form>
          </div>
        </div>
        <div class="activities-serch-main">
          <form>
            <div class="form-field search-field">
              <div class="js-clearSearchBox clearsearchbox">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1L0.999999 13"
                    stroke="#9B9B9B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 1L13 13"
                    stroke="#9B9B9B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <input
                type="search"
                class="form-control js-searchBox-input"
                name="search-field"
                placeholder="Search..."
              />
              <div class="search-btn">
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
                    stroke-width="0.975"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M11.8071 11.8066L15.0005 15"
                    stroke="#969696"
                    stroke-width="0.975"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="activity-user-list-wrap">
        <div class="activity-month">September 2022</div>
        <ul class="activity-lw-main">
          {activitiesList?.map((item) => (
            <ActivityItem
              id={item.id}
              name={item.name}
              date={item.date}
              specification={item.specification}
              type={item.request_type}
              status={item.status}
              profileImg={item.profile_image}
              amount={item.amount}
              handleClick={handleActivityDetail}
            />
          ))}
        </ul>
        <div class="activity-month">August 2022</div>
        <ul class="activity-lw-main">
          <li>
            <div class="act-info-wrap-left">
              <div class="act-user-info-wrap d-flex">
                <div class="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div class="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div class="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div class="act-amt-status-wrap d-flex">
                <div class="act-status-wrap">
                  <button class="btn btn-green">
                    Request received
                    <IconActReqReceive />
                  </button>
                </div>
                <div class="act-amt-wrap green-text">+ 123.45 Nafl</div>
              </div>
            </div>
            <div class="act-mv-wrap">
              <div class="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
          <li>
            <div class="act-info-wrap-left">
              <div class="act-user-info-wrap d-flex">
                <div class="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div class="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div class="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div class="act-amt-status-wrap d-flex">
                <div class="act-status-wrap">
                  <button class="btn btn-blue">
                    Request Sent
                    <IconActReqSent />
                  </button>
                </div>
                <div class="act-amt-wrap green-text">+ 123.45 Nafl</div>
              </div>
            </div>
            <div class="act-mv-wrap">
              <div class="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
          <li>
            <div class="act-info-wrap-left">
              <div class="act-user-info-wrap d-flex">
                <div class="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div class="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div class="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div class="act-amt-status-wrap d-flex">
                <div class="act-status-wrap">
                  <button class="btn btn-red">
                    Decline
                    <IconActReqDecline />
                  </button>
                </div>
                <div class="act-amt-wrap green-text">+ 123.45 Nafl</div>
              </div>
            </div>
            <div class="act-mv-wrap">
              <div class="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
          <li>
            <div class="act-info-wrap-left">
              <div class="act-user-info-wrap d-flex">
                <div class="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div class="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div class="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div class="act-amt-status-wrap d-flex">
                <div class="act-status-wrap">
                  <button class="btn btn-red">
                    Cancel
                    <IconActReqCancel />
                  </button>
                </div>
                <div class="act-amt-wrap red-text">- 123.45 Nafl</div>
              </div>
            </div>
            <div class="act-mv-wrap">
              <div class="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Modal
        show={showFilter}
        setShow={setShowFilter}
        classNameChild={"schedule-time-modal"}
      >
        <div className="modal-dialog modal-dialog-centered w-50">
          <div className="modal-content p-4">
            <div className="modal-header flex-column pb-3">
              <h3 className="text-center">Data Filter</h3>
            </div>
            <ReactDatePicker
              selected={filters.startDate}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={handleChangeDateFilter}
              selectsRange
              inline
            />
          </div>
        </div>
      </Modal>
      <ModalActivityDetail
        id="user-details-popup"
        className="user-details-modal"
        show={showDetails}
        setShow={setShowDetails}
        details={activityDetails}
        handleCancel={handleActivityDiscard}
        handleSubmit={handleActivityRespond}
      />
    </div>
  );
};

export default Activities;
