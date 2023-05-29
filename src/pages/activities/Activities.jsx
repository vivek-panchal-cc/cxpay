import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { IconCalender, IconCross, IconRefresh, IconSearch } from "styles/svgs";
import ActivityItem from "components/items/ActivityItem";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import { uniqueId } from "helpers/commonHelpers";
import { ActivityContext } from "context/activityContext";
import useActivities from "hooks/useActivities";
import Input from "components/ui/Input";

const Activities = () => {
  const { handleActivityDetail, reloadList } = useContext(ActivityContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [serachText, setSearchText] = useState("");
  const [activitiesDateBind, setActivitiesDateBind] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [loadingAct, actPagination, activitiesList, reload] = useActivities({
    page: currentPage,
    search: serachText,
    start_date: filters.startDate ? filters.startDate.toLocaleDateString() : "",
    end_date: filters.endDate ? filters.endDate.toLocaleDateString() : "",
  });

  useEffect(() => {
    if (!activitiesList) return;
    const activityDateList = {};
    activitiesList?.map((item) => {
      const [dd, mm, yr] = item?.date?.split("/");
      const dt = new Date(`${yr}-${mm}-${dd}`);
      const month = dt.toLocaleDateString("default", { month: "long" });
      const dtList = activityDateList[`${month} ${yr}`] || [];
      activityDateList[`${month} ${yr}`] = [...dtList, item];
    });
    setActivitiesDateBind(activityDateList);
  }, [activitiesList]);

  const handleChangeDateFilter = async ({ startDate, endDate }) => {
    if (!startDate || !endDate) return;
    setFilters({
      startDate: startDate,
      endDate: endDate,
    });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleResetFilter = async () => {
    setCurrentPage(1);
    setFilters({
      startDate: "",
      endDate: "",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const page = actPagination ? actPagination.current_page : 1;
    reload();
  }, [reloadList]);

  return (
    <div className="activities-sec">
      <div className="col-12 send-payment-ttile-wrap sdp-main-new-1">
        <div className="title-content-wrap send-pay-title-sec">
          <h3>Activities</h3>
          <p></p>
        </div>
        <div className="schedule-pay-sd-wrap">
          <div className="date-main-div d-flex">
            {/* <div className="form-field search-field">
              <div
                className="clearsearchbox"
                style={{ opacity: false ? 1 : 0 }}
                onClick={() => {}}
              >
                <IconCross />
              </div>
              <Input
                type="search"
                className="form-control js-searchBox-input"
                name="search_field"
                placeholder="Search..."
                value={""}
                onChange={() => {}}
              />
              <div className="search-btn">
                <IconSearch style={{ stroke: "#0081c5" }} />
              </div>
            </div> */}
            <div
              className="date-inner-div mr-0"
              onClick={() => setShowFilter(true)}
            >
              <input
                id="from-date"
                type="text"
                className="form-control"
                placeholder="From"
                value={
                  filters.startDate
                    ? `${filters.startDate.toLocaleDateString(
                        "en-UK"
                      )} - ${filters.endDate.toLocaleDateString("en-UK")}`
                    : "From - To"
                }
                readOnly
              />
              <span className="date-cal">
                <IconCalender style={{ stroke: "#0081C5" }} />
              </span>
            </div>
            <button className="shedule-date-filter" onClick={handleResetFilter}>
              <IconRefresh />
            </button>
          </div>
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
              <ul className="activity-lw-main">
                {activitiesDateBind[key]?.map((activity) => {
                  const uid = uniqueId();
                  return (
                    <ActivityItem
                      key={uid}
                      activityDetails={activity}
                      handleClick={handleActivityDetail}
                    />
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
      {!loadingAct && Object.keys(activitiesDateBind || {}).length <= 0 && (
        <div className="text-center py-4">
          <p className="fs-5">Activities not found.</p>
        </div>
      )}
      {!loadingAct && actPagination && actPagination.total > 10 && (
        <Pagination
          active={actPagination?.current_page}
          size={actPagination?.last_page}
          siblingCount={2}
          onClickHandler={handlePageChange}
        />
      )}
      <ModalDateRangePicker
        show={showFilter}
        setShow={setShowFilter}
        classNameChild={"schedule-time-modal"}
        heading="Date Filter"
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
    </div>
  );
};

export default Activities;
