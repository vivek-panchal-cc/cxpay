import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { IconCalender } from "styles/svgs";
import ActivityItem from "components/items/ActivityItem";
import Modal from "components/modals/Modal";
import ReactDatePicker from "react-datepicker";
import ModalActivityDetail from "components/modals/ModalActivityDetail";
import { toast } from "react-toastify";
import { SendPaymentContext } from "context/sendPaymentContext";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import {
  ACT_REQUEST_RECEIVE,
  ACT_REQUEST_SEND,
  ACT_STATUS_CANCELLED,
  ACT_STATUS_DECLINED,
  ACT_STATUS_PENDING,
  ACT_TYPE_REQUEST,
} from "constants/all";
import ModalConfirmation from "components/modals/ModalConfirmation";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";

const Activities = () => {
  const { handleSendContacts } = useContext(SendPaymentContext);
  const [loadingAct, setLoadingAct] = useState(false);
  const [loadingActDetails, setLoadingActDetails] = useState(false);
  const [activitiesList, setActivitiesList] = useState([]);
  const [activitiesDateBind, setActivitiesDateBind] = useState({});
  const [actPagination, setActPagination] = useState({});
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    search: "",
  });
  const [discardActDetail, setDiscardActDetail] = useState({
    heading: "",
    subHeading: "",
    status: "",
    request_id: "",
  });
  const [activityDetails, setActivityDetails] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const getActivitiesList = async (page = 1, filters = {}) => {
    setLoadingAct(true);
    try {
      const { data } = await apiRequest.activityList({ page, ...filters });
      if (!data.success) throw data.message;
      const { transactions, pagination } = data.data || {};
      const activityDateList = {};
      transactions?.map((item) => {
        const [dd, mm, yr] = item?.date?.split("/");
        const dt = new Date(`${yr}-${mm}-${dd}`);
        const month = dt.toLocaleDateString("default", { month: "long" });
        const dtList = activityDateList[`${month} ${yr}`] || [];
        activityDateList[`${month} ${yr}`] = [...dtList, item];
      });
      setActivitiesDateBind(activityDateList);
      setActivitiesList(transactions);
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
      setShowDetails(false);
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
        setDiscardActDetail({
          heading: "Decline Request",
          subHeading: "Are you sure to decline the requested payment?",
          request_id,
          status: ACT_STATUS_DECLINED,
        });
        setShowConfirmPopup(true);
        return;
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PENDING}`:
        setDiscardActDetail({
          heading: "Cancel Request",
          subHeading: "Are you sure to cancel the request ?",
          request_id,
          status: ACT_STATUS_CANCELLED,
        });
        setShowConfirmPopup(true);
        return;
    }
  };

  const handleConfirmActivityDiscard = async () => {
    const { request_id, status } = discardActDetail;
    if (!request_id || !status) return;
    setShowConfirmPopup(false);
    await changeActivityStatus(request_id, status);
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
          <p></p>
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
                  value={filters?.startDate?.toLocaleDateString()}
                  onClick={() => setShowFilter(true)}
                  readOnly
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
                  value={filters?.endDate?.toLocaleDateString()}
                  onClick={() => setShowFilter(true)}
                  readOnly
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
        {loadingAct
          ? [1, 2, 3, 4, 5, 6, 7].map((item) => (
              <LoaderActivityItem key={item} />
            ))
          : Object.keys(activitiesDateBind)?.map((key) => (
              <div key={key}>
                <div className="activity-month">{key}</div>
                <ul className="activity-lw-main">
                  {activitiesDateBind[key]?.map((activity) => (
                    <ActivityItem
                      key={activity?.id}
                      activityDetails={activity}
                      handleClick={handleActivityDetail}
                    />
                  ))}
                </ul>
              </div>
            ))}
        {/* <div className="activity-month">September 2022</div>
        <ul className="activity-lw-main">
          {loadingAct
            ? [1, 2, 3, 4, 5, 6, 7].map((item) => (
                <LoaderActivityItem key={item} />
              ))
            : activitiesList?.map((item) => (
                <ActivityItem
                  key={item?.id}
                  activityDetails={item}
                  handleClick={handleActivityDetail}
                />
              ))}
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
      <ModalDateRangePicker
        show={showFilter}
        setShow={setShowFilter}
        classNameChild={"schedule-time-modal"}
        heading="Data Filter"
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
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
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        heading={discardActDetail.heading}
        subHeading={discardActDetail.subHeading}
        handleCallback={handleConfirmActivityDiscard}
      />
    </div>
  );
};

export default Activities;
