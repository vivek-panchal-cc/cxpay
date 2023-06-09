import React, { useState } from "react";
import WithdrawBankList from "components/lists/WithdrawBankList";
import Pagination from "components/pagination/Pagination";
import TabsWithdrawOptions from "components/tabs/TabsWithdrawOptions";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import InputDateRange from "components/ui/InputDateRange";
import Button from "components/ui/Button";
import InputDropdown from "components/ui/InputDropdown";
import { IconPlusLarge } from "styles/svgs";
import useWithdrawBankList from "hooks/useWithdrawBankList";
import { useNavigate } from "react-router-dom";
import {
  WITHDRAW_OPTIONS_TABS_LIST,
  WITHDRAW_STATUS_FILTER_LIST,
} from "constants/all";

const WithdrawalsBank = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [drawStatus, setDrawStatus] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [loadingWithdrawList, pagination, listWithdraws, reload] =
    useWithdrawBankList({
      page: currentPage,
      start_date: filters.startDate
        ? filters.startDate?.toLocaleDateString()
        : "",
      end_date: filters.endDate ? filters.endDate?.toLocaleDateString() : "",
      status: drawStatus,
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

  const handleChangeStatusFilter = (statuses = []) => {
    if (!statuses) return;
    setDrawStatus(statuses);
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setDrawStatus([]);
    setFilters({
      startDate: "",
      endDate: "",
    });
  };

  const handleRequestWithdraw = (e) => {
    navigate(`/wallet/withdraw-bank/${"bank"}`);
  };

  return (
    <div className="walllet-refund-wrapper wb-refund-wrapper">
      <div className="wr-title-wrap">
        <h2>Wallet Transactions</h2>
      </div>
      <TabsWithdrawOptions
        className="wr-page-link-wrap d-flex"
        tabsList={WITHDRAW_OPTIONS_TABS_LIST}
      />
      {/* Refund Filter Element Start */}
      <div className="refund-filter-wrapper d-flex wr-bank-fillter-wrap">
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
            <Button className="solid-btn">Apply</Button>
            <Button className="border-btn" onClick={handleResetFilters}>
              Clear
            </Button>
          </div>
        </div>
        <div className="wrb-req-btn ">
          <Button className="btn" onClick={handleRequestWithdraw}>
            <IconPlusLarge fill="#fff" />
            Request Withdraw
          </Button>
        </div>
      </div>
      {/* Withdraw Card List */}
      <div className="refund-cards-list-wrap refund-comn-list-wrap">
        <WithdrawBankList classNameList="refund-comn-ul bank-refund-ul" />
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

export default WithdrawalsBank;
