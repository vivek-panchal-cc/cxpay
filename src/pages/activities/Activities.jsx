import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { IconCalender } from "styles/svgs";
import ActivityItem from "components/items/ActivityItem";
import Modal from "components/modals/Modal";
import ReactDatePicker from "react-datepicker";
import ModalActivityDetail from "components/modals/ModalActivityDetail";
import { toast } from "react-toastify";
import { SendPaymentContext } from "context/sendPaymentContext";
import {
  ACT_REQUEST_RECEIVE,
  ACT_REQUEST_SEND,
  ACT_STATUS_CANCELLED,
  ACT_STATUS_DECLINED,
  ACT_STATUS_PENDING,
  ACT_TYPE_REQUEST,
} from "constants/all";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";

const Activities = () => {
  const { handleSendContacts } = useContext(SendPaymentContext);
  const [loadingAct, setLoadingAct] = useState(false);
  const [loadingActDetails, setLoadingActDetails] = useState(false);
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

  const getActivitiesList = async (page = 1, filters = {}) => {
    setLoadingAct(true);
    try {
      const { data } = await apiRequest.activityList({ page, ...filters });
      if (!data.success) throw data.message;
      const { request_payments, pagination } = data.data || {};
      request_payments?.map((item) => {
        console.log(item);
      });
      setActivitiesList(request_payments);
      setActPagination(pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAct(false);
    }
  };

  const changeActivityStatus = async (request_id, status) => {
    if (!request_id) return;
    setLoadingAct(true);
    try {
      const { data } = await apiRequest.changeRequestStatus({
        request_id,
        status,
      });
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
      await getActivitiesList();
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setLoadingAct(false);
    }
  };

  const handleChangeDateFilter = async (dates) => {
    const [start, end] = dates;
    setFilters((e) => ({ ...e, startDate: start, endDate: end }));
    if (start && end) {
      setShowFilter(false);
      await getActivitiesList(actPagination.current_page, {
        start_date: start?.toLocaleDateString(),
        end_date: end?.toLocaleDateString(),
      });
    }
  };

  const handleActivityDetail = async ({ id, activity_type, reference_id }) => {
    if (!id || !activity_type) return;
    setShowDetails(true);
    setLoadingActDetails(true);
    try {
      const { data } = await apiRequest.getActivityDetails({
        request_payment_id: id,
        type: activity_type,
        reference_id,
      });
      if (!data.success) throw data.message;
      setActivityDetails(data?.data);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setLoadingActDetails(false);
    }
  };

  const handleActivityDiscard = async (actDetails) => {
    const { activity_type, request_type, status, request_id } =
      actDetails || {};
    setShowDetails(false);
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
        await changeActivityStatus(request_id, ACT_STATUS_DECLINED);
        return;
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PENDING}`:
        await changeActivityStatus(request_id, ACT_STATUS_CANCELLED);
        return;
    }
  };

  const handleActivityRespond = (actDetails) => {
    const { activity_type, request_type, status, request_id } =
      actDetails || {};
    setShowDetails(false);
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
        const contact = {
          name: actDetails?.name,
          profile_image: actDetails?.image,
          specifications: actDetails?.specification,
          personal_amount: parseFloat(actDetails?.amount || "0").toFixed(2),
          receiver_account_number: actDetails?.account_number,
        };
        handleSendContacts([contact], request_id);
        return;
    }
  };

  useEffect(() => {
    getActivitiesList();
  }, []);

  return (
    <div className="activities-sec">
      <div className="activities-top-sec activity-top-new">
        <div className="title-content-wrap">
          <h3>Activities</h3>
          <p>Lorem Ipsum Dolor Sit Amet</p>
        </div>
        <div className="activity-date-wrap date-wrap d-flex align-items-center">
          <div className="date-main-div d-flex">
            <div className="date-inner-div">
              <form>
                <input
                  id="from-date"
                  type="text"
                  className="form-control"
                  placeholder="From"
                  readOnly
                  value={filters?.startDate?.toLocaleDateString()}
                  onClick={() => setShowFilter(true)}
                />
                <span className="date-cal">
                  <IconCalender style={{ stroke: "#0081C5" }} />
                </span>
              </form>
            </div>
            <div className="date-inner-div">
              <form>
                <input
                  id="date-end-range"
                  type="text"
                  className="form-control"
                  placeholder="To"
                  readOnly
                  value={filters?.endDate?.toLocaleDateString()}
                  onClick={() => setShowFilter(true)}
                />
                <span className="date-cal">
                  <IconCalender style={{ stroke: "#0081C5" }} />
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="activity-user-list-wrap">
        <div className="activity-month">September 2022</div>
        <ul className="activity-lw-main">
          {loadingAct
            ? [1, 2, 3, 4, 5, 6, 7].map((item) => (
                <LoaderActivityItem key={item} />
              ))
            : activitiesList?.map((item) => (
                <ActivityItem
                  activityDetails={item}
                  handleClick={handleActivityDetail}
                />
              ))}
        </ul>

        {/* <div className="activity-month">August 2022</div> */}
        {/* <ul className="activity-lw-main">
          <li>
            <div className="act-info-wrap-left">
              <div className="act-user-info-wrap d-flex">
                <div className="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div className="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div className="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div className="act-amt-status-wrap d-flex">
                <div className="act-status-wrap">
                  <button className="btn btn-green">
                    Request received
                    <IconActReqReceive />
                  </button>
                </div>
                <div className="act-amt-wrap green-text">+ 123.45 Nafl</div>
              </div>
            </div>
            <div className="act-mv-wrap">
              <div className="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="act-info-wrap-left">
              <div className="act-user-info-wrap d-flex">
                <div className="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div className="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div className="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div className="act-amt-status-wrap d-flex">
                <div className="act-status-wrap">
                  <button className="btn btn-blue">
                    Request Sent
                    <IconActReqSent />
                  </button>
                </div>
                <div className="act-amt-wrap green-text">+ 123.45 Nafl</div>
              </div>
            </div>
            <div className="act-mv-wrap">
              <div className="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="act-info-wrap-left">
              <div className="act-user-info-wrap d-flex">
                <div className="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div className="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div className="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div className="act-amt-status-wrap d-flex">
                <div className="act-status-wrap">
                  <button className="btn btn-red">
                    Decline
                    <IconActReqDecline />
                  </button>
                </div>
                <div className="act-amt-wrap green-text">+ 123.45 Nafl</div>
              </div>
            </div>
            <div className="act-mv-wrap">
              <div className="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="act-info-wrap-left">
              <div className="act-user-info-wrap d-flex">
                <div className="act-user-thumb">
                  <img src="images/activity-use-image02.jpg" alt="" />
                </div>
                <div className="act-user-in">
                  <h2>Contact Name</h2>
                  <p>01 Sep 2022, at 18:00 PM</p>
                </div>
              </div>
              <div className="act-specification-text">
                <p>Specification will written here</p>
              </div>
              <div className="act-amt-status-wrap d-flex">
                <div className="act-status-wrap">
                  <button className="btn btn-red">
                    Cancel
                    <IconActReqCancel />
                  </button>
                </div>
                <div className="act-amt-wrap red-text">- 123.45 Nafl</div>
              </div>
            </div>
            <div className="act-mv-wrap">
              <div className="act-edit-btn">
                <button>
                  <IconEyeOpen />
                </button>
              </div>
            </div>
          </li>
        </ul> */}
      </div>
      {!loadingAct && actPagination && actPagination.current_page && (
        <Pagination
          active={actPagination?.current_page}
          size={actPagination?.last_page}
          siblingCount={2}
          onClickHandler={getActivitiesList}
        />
      )}
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
        loading={loadingActDetails}
        details={activityDetails}
        handleCancel={handleActivityDiscard}
        handleSubmit={handleActivityRespond}
      />
    </div>
  );
};

export default Activities;
