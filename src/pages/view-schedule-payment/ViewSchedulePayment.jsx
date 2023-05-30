import SchedulePaymentItem from "components/items/SchedulePaymentItem";
import ModalConfirmation from "components/modals/ModalConfirmation";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import Pagination from "components/pagination/Pagination";
import { ScheduledPaymentContext } from "context/scheduledPaymentContext";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import React, { useContext, useEffect, useState } from "react";
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
    startDate: "",
    endDate: "",
  });

  const handleChangeDateFilter = async ({ startDate, endDate }) => {
    if (!startDate || !endDate) return;
    setFilters({ startDate: startDate, endDate: endDate });
    setShowFilter(false);
    handleDateFilter(
      startDate.toLocaleDateString(),
      endDate.toLocaleDateString()
    );
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
      startDate: "",
      endDate: "",
    });
    resetDateFilter();
  };

  useEffect(() => {
    if (!listPayments) return;
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
            <h3>My Scheduled Payment</h3>
          </div>
          <div className="schedule-pay-sd-wrap gap-4">
            <div
              className="date-filter-calendar"
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
                <IconCalender style={{ stroke: "#c4c4c4" }} />
              </span>
            </div>
            <button className="shedule-date-filter" onClick={handleResetFilter}>
              <IconRefresh />
            </button>
          </div>
        </div>

        <div className="activity-user-list-wrap">
          {loadingPayments ? (
            <div className="pt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <LoaderActivityItem key={item} />
              ))}
            </div>
          ) : (
            Object.keys(paymentsDateBind)?.map((key) => (
              <div key={key}>
                <div className="activity-month">{key}</div>
                <ul className="act-user-content-wrap">
                  {paymentsDateBind[key]?.map((item) => {
                    const isGroup =
                      typeof item.is_group === "string" && item.is_group
                        ? parseInt(item.is_group)
                        : item.is_group;
                    const profileURL = isGroup
                      ? "/assets/images/group_contact_profile.png"
                      : item.image ||
                        "/assets/images/single_contact_profile.png";
                    return (
                      <SchedulePaymentItem
                        key={item.id}
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
        {!loadingPayments &&
          Object.keys(paymentsDateBind || {}).length <= 0 && (
            <div className="text-center py-4">
              <p className="fs-5">Schedule payments not found.</p>
            </div>
          )}
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
        heading="Date Filter"
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
