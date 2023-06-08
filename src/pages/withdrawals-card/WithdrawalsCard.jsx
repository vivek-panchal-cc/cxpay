import React, { useState } from "react";
import WithdrawCardList from "components/lists/WithdrawCardList";
import Pagination from "components/pagination/Pagination";
import TabsWithdrawOptions from "components/tabs/TabsWithdrawOptions";
import { WITHDRAW_OPTIONS_TABS_LIST } from "constants/all";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import InputDateRange from "components/ui/InputDateRange";
import InputDropdown from "components/ui/InputDropdown";

const WithdrawalsCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [drawStatus, setDrawStatus] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const handleChangeDateFilter = ({ startDate, endDate }) => {
    if (!startDate || !endDate) return;
    setFilters({
      startDate: startDate,
      endDate: endDate,
    });
    setCurrentPage(1);
    setShowDateFilter(false);
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setDrawStatus("");
    setFilters({
      startDate: "",
      endDate: "",
    });
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
              handleClick={() => setShowDateFilter(true)}
              startDate={filters.startDate}
              endDate={filters.endDate}
            />
          </div>
          <div className="refund-sf-wrap">
            <p>Status Filter</p>
            <InputDropdown
              id="refund-status-dd"
              className="dropdown-check-list"
              value="Status"
              handleClick={() => {}}
            />
          </div>
          <div className="refund-filter-btn-wrap">
            <button className="solid-btn">Apply</button>
            <button className="border-btn" onClick={handleResetFilters}>
              Clear
            </button>
          </div>
        </div>
        <div></div>
      </div>
      {/* Withdraw Card List */}
      <div className="refund-cards-list-wrap refund-comn-list-wrap">
        <WithdrawCardList classNameList="card-refund-ul refund-comn-ul" />
        <Pagination
          active={1}
          size={5}
          siblingCount={2}
          onClickHandler={() => {}}
        />
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
