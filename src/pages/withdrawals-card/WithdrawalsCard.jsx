import React, { useState } from "react";
import WithdrawCardList from "components/lists/WithdrawCardList";
import Pagination from "components/pagination/Pagination";
import TabsWithdrawOptions from "components/tabs/TabsWithdrawOptions";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import InputDateRange from "components/ui/InputDateRange";
import InputDropdown from "components/ui/InputDropdown";
import Button from "components/ui/Button";
import {
  WITHDRAW_OPTIONS_TABS_LIST,
  WITHDRAW_STATUS_FILTER_LIST,
} from "constants/all";
import useWithdrawCardList from "hooks/useWithdrawCardList";

const WithdrawalsCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [drawStatus, setDrawStatus] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [allFilters, setAllFilters] = useState({
    start_date: "",
    end_date: "",
    status: [],
  });
  const [loadingWithdrawList, pagination, listWithdraws, reload] =
    useWithdrawCardList({
      page: currentPage,
      start_date: allFilters.start_date,
      end_date: allFilters.end_date,
      status: allFilters.status,
    });

  // For date filter changes
  const handleChangeDateFilter = ({ startDate, endDate }) => {
    if (!startDate || !endDate) return;
    setFilters({
      startDate: startDate,
      endDate: endDate,
    });
    setCurrentPage(1);
    setShowDateFilter(false);
    setFiltersChanged(true);
  };

  // For status filter changes
  const handleChangeStatusFilter = (statuses = []) => {
    if (!statuses) return;
    setDrawStatus(statuses);
    setFiltersChanged(true);
  };

  // For handling apply filter button click
  const handleApplyFilters = () => {
    const filStatus = drawStatus;
    const filStrDate = filters.startDate
      ? filters.startDate?.toLocaleDateString()
      : "";
    const filEndDate = filters.endDate
      ? filters.endDate?.toLocaleDateString()
      : "";
    setAllFilters({
      start_date: filStrDate,
      end_date: filEndDate,
      status: filStatus,
    });
    setFiltersChanged(false);
  };

  // For handling reset filter button click
  const handleResetFilters = () => {
    setCurrentPage(1);
    setDrawStatus([]);
    setFilters({
      startDate: "",
      endDate: "",
    });
  };

  // For changing page from pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="walllet-refund-wrapper">
      <div className="wr-title-wrap">
        <h2>Wallet Transactions</h2>
      </div>
      <TabsWithdrawOptions
        className="wr-page-link-wrap d-flex"
        tabsList={WITHDRAW_OPTIONS_TABS_LIST}
      />
      {/* Refund Filter Element Start */}
      <div className="refund-filter-wrapper d-flex">
        <div className="d-flex rf-details-div">
          <div className="refund-dr-wrap">
            <p>Date Range</p>
            <InputDateRange
              className="date-filter-calendar"
              onClick={() => setShowDateFilter(true)}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
          </div>
          <div className="refund-sf-wrap">
            <p>Status Filter</p>
            <InputDropdown
              id="refund-status-dd"
              className="dropdown-check-list"
              title="Status"
              dropList={WITHDRAW_STATUS_FILTER_LIST}
              onChange={handleChangeStatusFilter}
            />
          </div>
          <div className="refund-filter-btn-wrap">
            <Button
              className="solid-btn position-relative"
              onClick={handleApplyFilters}
            >
              Apply
              {filtersChanged && (
                <span className="position-absolute top-0 start-100 translate-middle p-2 rounded-circle bg-danger border border-light">
                  <span className="visually-hidden">New alerts</span>
                </span>
              )}
            </Button>
            <Button className="border-btn" onClick={handleResetFilters}>
              Clear
            </Button>
          </div>
        </div>
        <div></div>
      </div>
      {/* Withdraw Card List */}
      <div className="refund-cards-list-wrap refund-comn-list-wrap">
        <WithdrawCardList
          classNameList="card-refund-ul refund-comn-ul"
          list={listWithdraws}
        />
        {pagination && pagination.total > 10 ? (
          <Pagination
            active={pagination?.current_page}
            size={pagination?.last_page}
            siblingCount={2}
            onClickHandler={handlePageChange}
          />
        ) : null}
      </div>
      <ModalDateRangePicker
        show={showDateFilter}
        setShow={setShowDateFilter}
        classNameChild={"schedule-time-modal"}
        heading="Date Filter"
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
    </div>
  );
};

export default WithdrawalsCard;
