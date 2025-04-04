import React, { useContext, useEffect, useState } from "react";
import { IconCross, IconExport, IconRefresh, IconSearch } from "styles/svgs";
import Pagination from "components/pagination/Pagination";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import Input from "components/ui/Input";
import InputDateRangeActivities from "components/ui/InputDateRangeActivities";
import MerchantFeesItem from "components/items/MerchantFeesItem";
import useMerchantFees from "hooks/useMerchantFees";
import { MerchantReportsContext } from "context/merchantReportsContext";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";
import { toast } from "react-toastify";

const MerchantFeesReport = () => {
  const { setIsLoading } = useContext(LoaderContext);
  const { handleMerchantReportDetails, reloadList } = useContext(
    MerchantReportsContext
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [serachText, setSearchText] = useState("");
  const [reportsDateBind, setReportsDateBind] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [loadingAct, actPagination, reportList, reload] = useMerchantFees({
    page: currentPage,
    search: serachText,
    from_date: filters.startDate ? filters.startDate : "",
    to_date: filters.endDate ? filters.endDate : "",
  });

  useEffect(() => {
    if (!reportList || reportList.length === 0) {
      setReportsDateBind({});
      return;
    }
    const merchantReportDateList = {};
    reportList?.map((item) => {
      const { created_at } = item || {};
      const [yr, mm, dd] = created_at?.split(" ")[0].split("-") || [];
      if (!dd || !mm || !yr) return false;
      const dt = new Date(`${yr}-${mm}-${dd}`);
      const month = dt.toLocaleDateString("default", { month: "long" });
      const dtList = merchantReportDateList[`${month} ${yr}`] || [];
      merchantReportDateList[`${month} ${yr}`] = [...dtList, item];
      return item;
    });
    setReportsDateBind(merchantReportDateList);
  }, [reportList]);

  const formatDate = (dateObj) => {
    if (dateObj instanceof Date) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${month}/${day}/${year}`;
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

  const handleResetFilter = async () => {
    setCurrentPage(1);
    setFilters({
      startDate: "",
      endDate: "",
    });
  };

  const handleExportMerchantReports = async () => {
    setIsLoading(true);
    let reqParams = {
      search: serachText,
      from_date: filters.startDate,
      to_date: filters.endDate,
    };
    try {
      const { data } = await apiRequest.exportMerchantReports(reqParams);
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
      const base64csv = data.data;
      const dtnow = new Date().toISOString();
      const csvContent = atob(base64csv);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const downloadLink = document.createElement("a");
      const fileName = `MERCHANT_REPORTS_${dtnow}.csv`;
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchReport = (elm) => {
    setCurrentPage(1);
    setSearchText(elm.target.value);
  };

  // useEffect(() => {
  //   reload();
  // }, [reloadList]);

  return (
    <div className="activities-sec">
      <div className="col-12 send-payment-ttile-wrap sdp-main-new-1 justify-content-between">
        <div className="title-content-wrap send-pay-title-sec w-auto">
          <h3>Merchant Fees Report</h3>
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
              onChange={handleSearchReport}
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
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
          <button className="shedule-date-filter" onClick={handleResetFilter}>
            <IconRefresh />
          </button>
          {Object.keys(reportsDateBind || {}).length > 0 ? (
            <button
              className={`export-activities ${
                Object.keys(reportsDateBind || {}).length <= 0 ? "disabled" : ""
              } tooltip-btn`}
              disabled={Object.keys(reportsDateBind || {}).length <= 0}
              onClick={handleExportMerchantReports}
            >
              <IconExport stroke={"#ffff"} />
              <span className="tooltip-text">Export</span>
            </button>
          ) : null}
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
          Object.keys(reportsDateBind)?.map((key) => (
            <div key={key}>
              <div className="activity-month">{key}</div>
              <ul className="activity-lw-main">
                {reportsDateBind[key]?.map((report, index) => {
                  return (
                    <MerchantFeesItem
                      key={report?.ref_id || index}
                      reportDetails={report}
                      handleClick={handleMerchantReportDetails}
                    />
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
      {!loadingAct
        ? Object.keys(reportsDateBind || {}).length <= 0 && (
            <div className="text-center py-4">
              <p className="fs-5">Merchant fees report not found.</p>
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
    </div>
  );
};

export default MerchantFeesReport;
