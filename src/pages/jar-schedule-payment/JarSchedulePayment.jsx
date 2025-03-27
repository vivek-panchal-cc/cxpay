import React, { useContext, useEffect, useState } from "react";
import { IconCross, IconSearch } from "styles/svgs";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import { ActivityContext } from "context/activityContext";
import Input from "components/ui/Input";
import JarActivityItem from "components/items/JarActivityItem";
import useJarActivityList from "hooks/useJarActivityList";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { Link, Navigate } from "react-router-dom";
import JarSchedulePayItem from "components/items/JarSchedulePayItem";
import useJarSchedulePayList from "hooks/useJarSchedulePayList";
import ModalConfirmation from "components/modals/ModalConfirmation";

const JarSchedulePayment = () => {
  const { jarId, handleScheduledPaymentDetails, deleteScheduleItem } =
    useContext(SavingJarOwnContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [serachText, setSearchText] = useState("");
  const [activitiesDateBind, setActivitiesDateBind] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [deletePopup, setDeletePopup] = useState(false);
  const [scheduledItemId, setScheduledItemId] = useState(null);
  const [loadingAct, actPagination, activitiesList, reload] =
    useJarSchedulePayList({
      page: currentPage,
      jar_id: jarId,
      search_name: serachText,
    });

  useEffect(() => {
    if (!activitiesList) return;
    const activityDateList = {};
    activitiesList?.map((item) => {
      const { created_at } = item || {};
      // const [dd, mm, yr] = date?.split("/") || [];
      const [yr, mm, dd] = created_at?.split(" ")[0].split("-") || [];
      if (!dd || !mm || !yr) return false;
      const dt = new Date(`${yr}-${mm}-${dd}`);
      const month = dt.toLocaleDateString("default", { month: "long" });
      const dtList = activityDateList[`${month} ${yr}`] || [];
      activityDateList[`${month} ${yr}`] = [...dtList, item];
      return item;
    });
    setActivitiesDateBind(activityDateList);
  }, [activitiesList]);

  const formatDate = (dateObj) => {
    if (dateObj instanceof Date) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return null;
  };

  const handleChangeDateFilter = async ({ startDate, endDate }) => {
    if (!startDate || !endDate) return;

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    setFilters({ startDate: formattedStartDate, endDate: formattedEndDate });
    setShowFilter(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchActivity = (elm) => {
    setCurrentPage(1);
    setSearchText(elm.target.value);
  };

  const handleScheduleDeleteItem = async ({ id }) => {
    if (!id) return;
    setScheduledItemId(id);
    setDeletePopup(true);
  };

  const handleCallbackDeleteTransaction = async () => {
    if (!scheduledItemId) return;
    setDeletePopup(false);
    if (deleteScheduleItem) await deleteScheduleItem(scheduledItemId);
    setScheduledItemId(null);
    reload();
  };

  // useEffect(() => {
  //   reload();
  // }, [reloadList]);

  if (!jarId) return <Navigate to="/jars/own" replace />;

  return (
    <div className="activities-sec">
      <div className="col-12 send-payment-ttile-wrap sdp-main-new-1 justify-content-between">
        <div className="title-content-wrap send-pay-title-sec w-auto">
          <h3>
            {activitiesList?.length > 1
              ? "Jar Scheduled Payments"
              : "Jar Scheduled Payment"}
          </h3>
          <ul className="breadcrumb">
            <li>
              <Link to={`/jars/own/jar-details`}>Jars</Link>
            </li>
            <li>
              {activitiesList?.length > 1
                ? "Scheduled Payments"
                : "Scheduled Payment"}
            </li>
          </ul>
          <p></p>
        </div>
        <div className="schedule-pay-sd-wrap gap-4 flex-wrap w-auto">
          <div className="form-field search-field">
            <div
              className="clearsearchbox"
              style={{ opacity: serachText ? 1 : 0 }}
              onClick={() => setSearchText("")}
            >
              <IconCross />
            </div>
            <Input
              type="search"
              className="form-control js-searchBox-input"
              name="search_field"
              placeholder="Search..."
              value={serachText}
              onChange={handleSearchActivity}
            />
            <div className="search-btn">
              <IconSearch style={{ stroke: "#0081c5" }} />
            </div>
          </div>
          {/* <InputDateRangeActivities
            className="date-filter-calendar"
            onClick={() => {
              setShowFilter(true);
            }}
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
          <button className="shedule-date-filter" onClick={handleResetFilter}>
            <IconRefresh />
          </button> */}
        </div>
      </div>
      <div className="activity-user-list-wrap">
        {loadingAct ? (
          <div className="pt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <LoaderActivityItem key={item} />
            ))}
          </div>
        ) : (
          Object.keys(activitiesDateBind)?.map((key) => (
            <div key={key}>
              <div className="activity-month">{key}</div>
              <ul className="activity-lw-main jar-sch-pay-list">
                {activitiesDateBind[key]?.map((activity, index) => {
                  return (
                    <JarSchedulePayItem
                      key={activity?.id || index}
                      activityDetails={activity}
                      handleClick={handleScheduledPaymentDetails}
                      handleDelete={handleScheduleDeleteItem}
                    />
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
      {!loadingAct
        ? Object.keys(activitiesDateBind || {}).length <= 0 && (
            <div className="text-center py-5">
              <p className="fs-5">Jar scheduled payments not found.</p>
            </div>
          )
        : null}
      {!loadingAct && actPagination && actPagination.total > 10 ? (
        <Pagination
          active={actPagination?.current_page}
          size={actPagination?.last_page}
          siblingCount={2}
          onClickHandler={handlePageChange}
        />
      ) : null}
      <ModalDateRangePicker
        show={showFilter}
        setShow={setShowFilter}
        classNameChild={"schedule-time-modal"}
        heading="Date Filter"
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={deletePopup}
        setShow={setDeletePopup}
        heading={"Delete Transaction"}
        subHeading={
          <span
            className=""
            style={{ whiteSpace: "normal", wordWrap: "break-word" }}
          >
            Are you sure you want to delete this transaction?
          </span>
        }
        handleCallback={handleCallbackDeleteTransaction}
      />
    </div>
  );
};

export default JarSchedulePayment;
