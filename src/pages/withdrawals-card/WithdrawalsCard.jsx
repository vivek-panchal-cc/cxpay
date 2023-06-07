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
    <div>
      <div className="">
        <TabsWithdrawOptions tabsList={WITHDRAW_OPTIONS_TABS_LIST} />
        <div className="d-flex gap-2">
          <InputDateRange
            className="date-filter-calendar"
            handleClick={() => setShowDateFilter(true)}
            startDate={filters.startDate}
            endDate={filters.endDate}
          />
          <InputDropdown className="" handleClick={() => {}} value="Status" />
          <button onClick={handleResetFilters}>reset</button>
        </div>
        <WithdrawCardList />
        <Pagination
          active={1}
          size={5}
          siblingCount={2}
          onClickHandler={() => {}}
        />
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
    </div>
  );
};

export default WithdrawalsCard;
