import SchedulePaymentItem from "components/items/SchedulePaymentItem";
import ModalConfirmation from "components/modals/ModalConfirmation";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import Pagination from "components/pagination/Pagination";
import { ScheduledPaymentContext } from "context/scheduledPaymentContext";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconCalender, IconRefresh } from "styles/svgs";

const ViewSchedulePayment = () => {
  const [showFilter, setShowFilter] = useState(false);
  const {
    pagination,
    listPayments,
    loadingPayments,
    resetDateFilter,
    handleDateFilter,
    setCurrentPage,
    deleteScheduledPayment,
    handleSelectPaymentEntry,
  } = useContext(ScheduledPaymentContext);

  const [deletPaymentId, setDeletPaymentId] = useState(null);
  const [paymentsDateBind, setPaymentsDateBind] = useState({});
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const { strFilStartDt, strFilEndDt } = useMemo(() => {
    if (!filters.startDate || !filters.endDate)
      return { strFilEndDt: "", strFilStartDt: "" };
    const strFilStartDt = filters.startDate
      .toLocaleDateString("en-IN", {
        dateStyle: "medium",
      })
      .replace(/-/g, " ");
    const strFilEndDt = filters.endDate
      .toLocaleDateString("en-IN", {
        dateStyle: "medium",
      })
      .replace(/-/g, " ");
    return { strFilStartDt, strFilEndDt };
  }, [filters.startDate, filters.endDate]);

  const handleChangeDateFilter = async (dates) => {
    const [start, end] = dates;
    setFilters((e) => ({ startDate: start, endDate: end }));
    if (start && end) {
      setShowFilter(false);
      handleDateFilter(start, end);
    }
  };

  const handleDeletePayment = async (spid) => {
    if (!spid) return;
    setDeletPaymentId(spid);
    setShowConfirmPopup(true);
  };

  const confirmDeletePayment = async () => {
    setShowConfirmPopup(false);
    await deleteScheduledPayment(deletPaymentId);
    setDeletPaymentId(null);
  };

  const handleResetFilter = async () => {
    setFilters({
      startDate: new Date(),
      endDate: new Date(),
    });
    resetDateFilter();
  };

  useEffect(() => {
    if (!listPayments || listPayments.length <= 0) return;
    const paymentDateList = {};
    listPayments?.map((item) => {
      const dt = new Date(item?.payment_schedule_date);
      const month = dt.toLocaleDateString("default", { month: "long" });
      const dtList = paymentDateList[`${month} ${dt.getFullYear()}`] || [];
      paymentDateList[`${month} ${dt.getFullYear()}`] = [...dtList, item];
    });
    setPaymentsDateBind(paymentDateList);
  }, [listPayments]);

  return (
    <>
      <div className="activities-sec">
        <div className="col-12 send-payment-ttile-wrap sdp-main-new-1">
          <div className="title-content-wrap send-pay-title-sec">
            <h3>My Schedule Payment</h3>
          </div>
          <div className="schedule-pay-sd-wrap">
            <div className="date-main-div d-flex">
              <div className="date-inner-div">
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
              </div>
              <div className="date-inner-div">
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
              </div>
              <button
                className="shedule-date-filter"
                onClick={handleResetFilter}
              >
                <IconRefresh />
              </button>
            </div>
          </div>
        </div>

        <div className="activity-user-list-wrap">
          {loadingPayments ? (
            <LoaderActivityItem />
          ) : (
            Object.keys(paymentsDateBind)?.map((key) => (
              <div key={key}>
                <div className="activity-month">{key}</div>
                <ul className="act-user-content-wrap">
                  {paymentsDateBind[key]?.map((item) => {
                    const isGroup =
                      typeof item.isGroup === "string" && item.isGroup
                        ? parseInt(item.isGroup)
                        : item.isGroup;
                    const profileURL = isGroup
                      ? "/assets/images/group_contact_profile.png"
                      : item.image ||
                        "/assets/images/single_contact_profile.png";
                    return (
                      <SchedulePaymentItem
                        details={{
                          id: item.id,
                          name: item.name,
                          dateTime: item?.payment_schedule_date,
                          description: item?.overall_specification,
                          amount: item?.total,
                          profileImg: profileURL,
                        }}
                        handleEdit={handleSelectPaymentEntry}
                        handleDelete={handleDeletePayment}
                      />
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
        {!loadingPayments && pagination && pagination.total > 10 && (
          <Pagination
            active={pagination?.current_page}
            size={pagination?.last_page}
            siblingCount={2}
            onClickHandler={setCurrentPage}
          />
        )}
      </div>
      <ModalDateRangePicker
        show={showFilter}
        setShow={setShowFilter}
        classNameChild={"schedule-time-modal"}
        heading="Data Filter"
        startDate={filters.startDate}
        endDate={filters.endDate}
        handleChangeDateRange={handleChangeDateFilter}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        heading={"Delete Transaction"}
        subHeading={"Are you sure you want to delete this transaction?"}
        handleCallback={confirmDeletePayment}
      />
    </>
  );
};

export default ViewSchedulePayment;
