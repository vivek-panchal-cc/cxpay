import React, { useContext, useEffect, useState } from "react";
import { IconCross, IconRefresh, IconSearch } from "styles/svgs";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import Input from "components/ui/Input";
import InputDateRange from "components/ui/InputDateRange";
import useTopUpActivities from "hooks/useTopUpActivities";
import TopUpActivityItem from "components/items/TopUpActivityItem";
import { TopUpActivityContext } from "context/topUpActivityContext";
import InputDateRangeActivities from "components/ui/InputDateRangeActivities";

const TopUpActivities = () => {
  const { handleActivityDetail, reloadList } = useContext(TopUpActivityContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [serachText, setSearchText] = useState("");
  const [activitiesDateBind, setActivitiesDateBind] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });
  const [loadingAct, actPagination, activitiesList, reload] =
    useTopUpActivities({
      page: currentPage,
      search: serachText,
      from_date: filters.fromDate ? filters.fromDate : "",
      to_date: filters.toDate ? filters.toDate : "",
    });

  const mainDivStyle = {
    textAlign: "center",
    textTransform: "capitalize",
    color: "#363853",
    fontFamily: "Visby Round CF",
    fontStyle: "normal",
    fontWeight: "700",
  };

  const visibility = {
    visibility: "hidden",
  };

  const combinedStyle = { ...mainDivStyle, ...visibility };

  useEffect(() => {
    if (!activitiesList) return;
    const activityDateList = {};
    activitiesList?.map((item) => {
      const { date } = item || {};
      // const [dd, mm, yr] = date?.split("/") || [];
      const [yr, mm, dd] = date?.split(" ")[0].split("-") || [];
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

    setFilters({
      fromDate: formattedStartDate,
      toDate: formattedEndDate,
    });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleResetFilter = async () => {
    setCurrentPage(1);
    setFilters({
      fromDate: "",
      toDate: "",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchActivity = (elm) => {
    setCurrentPage(1);
    setSearchText(elm.target.value);
  };

  useEffect(() => {
    reload();
  }, [reloadList]);

  return (
    <div className="activities-sec">
      <div className="col-12 send-payment-ttile-wrap sdp-main-new-1 justify-content-between">
        <div className="title-content-wrap send-pay-title-sec w-auto">
          <h3>Activities</h3>
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
          <InputDateRangeActivities
            className="date-filter-calendar"
            onClick={() => {
              setShowFilter(true);
            }}
            startDate={filters.fromDate}
            endDate={filters.toDate}
          />
          <button className="shedule-date-filter" onClick={handleResetFilter}>
            <IconRefresh />
          </button>
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
          Object.keys(activitiesDateBind)?.map((key, index) => (
            <div key={key}>
              <table className="border-none full-width agent-recent-activity-list-table">
                {index === 0 ? (
                  <thead>
                    <tr>
                      <th className="activity-month">{key}</th>
                      <th style={mainDivStyle} className="topup-table-header">
                        Customer Amount
                      </th>
                      <th style={mainDivStyle} className="topup-table-header">
                        Commission
                      </th>
                      <th style={mainDivStyle} className="topup-table-header">
                        Total Amount
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                ) : (
                  index !== 0 && (
                    <thead>
                      <tr>
                        <th className="activity-month">{key}</th>
                        <th
                          style={combinedStyle}
                          className="topup-table-header"
                        >
                          Customer Amount
                        </th>
                        <th
                          style={combinedStyle}
                          className="topup-table-header"
                        >
                          Commission
                        </th>
                        <th
                          style={combinedStyle}
                          className="topup-table-header"
                        >
                          Total Amount
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                  )
                )}
                {/* <div className="activity-month">{key}</div> */}
                <tbody>
                  {activitiesDateBind[key]?.map((activity, index) => (
                    <TopUpActivityItem
                      key={activity?.id || index}
                      activityDetails={activity}
                      handleClick={handleActivityDetail}
                      visibleIcon={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      {!loadingAct
        ? Object.keys(activitiesDateBind || {}).length <= 0 && (
            <div className="text-center py-4">
              <p className="fs-5">Activities not found.</p>
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
        startDate={filters.fromDate}
        endDate={filters.toDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
    </div>
  );
};

export default TopUpActivities;
