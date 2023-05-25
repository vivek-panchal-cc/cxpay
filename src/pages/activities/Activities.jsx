import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { IconCalender, IconRefresh } from "styles/svgs";
import ActivityItem from "components/items/ActivityItem";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import { uniqueId } from "helpers/commonHelpers";
import { ActivityContext } from "context/activityContext";

const Activities = () => {
  const { handleActivityDetail, reloadList } = useContext(ActivityContext);

  const [loadingAct, setLoadingAct] = useState(false);
  const [activitiesList, setActivitiesList] = useState([]);
  const [activitiesDateBind, setActivitiesDateBind] = useState({});
  const [actPagination, setActPagination] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

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
      setActPagination(null);
      setActivitiesList([]);
      setActivitiesDateBind({});
    } finally {
      setLoadingAct(false);
    }
  };

  const handleChangeDateFilter = async (dates) => {
    const [start, end] = dates;
    setFilters({ startDate: start, endDate: end });
    if (start && end) {
      setShowFilter(false);
      const page = actPagination ? actPagination.current_page : 1;
      await getActivitiesList(page, {
        start_date: start?.toLocaleDateString(),
        end_date: end?.toLocaleDateString(),
      });
    }
  };

  const handleResetFilter = async () => {
    setFilters({
      startDate: "",
      endDate: "",
    });
    const page = actPagination ? actPagination.current_page : 1;
    await getActivitiesList(page);
  };

  useEffect(() => {
    getActivitiesList();
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
            <div className="date-inner-div">
              <input
                id="from-date"
                type="text"
                className="form-control"
                placeholder="From"
                value={
                  filters.startDate
                    ? filters.startDate?.toLocaleDateString("en-UK")
                    : "From"
                }
                onClick={() => setShowFilter(true)}
                readOnly
              />
              <span className="date-cal">
                <IconCalender style={{ stroke: "#0081C5" }} />
              </span>
            </div>
            <div className="date-inner-div">
              <input
                id="date-end-range"
                type="text"
                className="form-control"
                placeholder="To"
                value={
                  filters?.endDate
                    ? filters.endDate?.toLocaleDateString("en-UK")
                    : "To"
                }
                onClick={() => setShowFilter(true)}
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
      {Object.keys(activitiesDateBind || {}).length <= 0 && (
        <div className="text-center py-4">
          <p className="fs-5">Activities not found.</p>
        </div>
      )}
      {actPagination && (
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
        heading="Date Filter"
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
    </div>
  );
};

export default Activities;
