import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import {
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
  recurringTypeStatus,
} from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { IconCloseModal } from "styles/svgs";
import LoaderRecurringCards from "loaders/LoaderRecurringCards";
import LoaderJarWdrawHeader from "loaders/LoaderJarWdrawHeader";

const ModalRecurringPaymentDetails = (props) => {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    details,
    loading,
    allowClickOutSide,
    handleAcceptOrDecline,
  } = props;

  const {
    amount,
    specifications,
    schedule_date,
    recurring_start_date,
    recurring_end_date,
    frequency,
    recurring_dates,
    name,
    mobile_number,
    profile_image,
  } = details || {};

  const modalRef = useRef(null);

  const tableTr = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "25px",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        !allowClickOutSide && setShow && setShow(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setShow, allowClickOutSide]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDay = ("0" + date.getDate()).slice(-2); // Ensures it is two digits
    const formattedMonth = ("0" + (date.getMonth() + 1)).slice(-2); // Ensures it is two digits
    const formattedYear = date.getFullYear();

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  if (!show) return;

  if (loading) {
    return (
      <div
        className={`modal rese-modal-wrap fade show ${styles.modal} ${className}`}
        id={id}
      >
        <div ref={modalRef} className={classNameChild} style={{ width: "70%" }}>
          <div className="modal-dialog-reserved-amount modal-dialog-centered">
            <div className="modal-content">
              <IconCloseModal
                style={{
                  position: "absolute",
                  top: "25px",
                  right: "30px",
                  cursor: "pointer",
                }}
                onClick={() => setShow(false)}
              />{" "}
              <div className="res-data-wrap">
                <LoaderRecurringCards />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`modal rese-modal-wrap jar-invited-occrrences fade show ${styles.modal} ${className}`}
      id={id}
    >
      <div ref={modalRef} className={classNameChild} style={{ width: "70%" }}>
        <div className="modal-dialog-reserved-amount modal-dialog-centered">
          <div className="modal-content" style={{ position: "relative" }}>
            <IconCloseModal
              style={{
                position: "absolute",
                top: "25px",
                right: "30px",
                cursor: "pointer",
              }}
              onClick={() => setShow(false)}
            />{" "}
            <div className="jar-rc-refund-all-wrap">
              <div className="jar-rc-refund-main-wrap">
                <div className="rc-refund-main-inner">
                  <div className="rcr-innner-wrap rcr-innner-wrap-1 pb-0 d-flex flex-wrap w-100">
                    <div className="rcrc-img-wrap rcr-img-wrap">
                      <span bg-color="#000" className="user-thumb-name">
                        {profile_image ? (
                          <img src={profile_image} className="blue-bg" alt="" />
                        ) : (
                          <div
                            className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                              name
                            )}`}
                          >
                            {getInitials(name)}
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="rcr-info-main">
                      {loading ? (
                        <div className="rcr-info-1 d-flex gap-3">
                          <LoaderJarWdrawHeader />
                        </div>
                      ) : (
                        <div className="rcr-info-1 d-flex gap-3">
                          <div className="rcr-card-data">
                            <h2>{name}</h2>
                            <p>{`+${mobile_number}`}</p>
                          </div>
                          <div className="rcr-card-amt wbr-card-amt">
                            <h2 className={``} style={{ color: "#56BE15" }}>
                              <WrapAmount value={amount} />
                              <p>Total Amount</p>
                            </h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rcr-divider-wrap"></div>
                  <div className="rcr-innner-wrap rcr-innner-wrap-2 d-flex flex-wrap w-100">
                    <div className="w-50-md rcr-transition-info rcr-transition-info-1 first-rec-detail">
                      <table>
                        <tbody>
                          <tr style={tableTr}>
                            <td>Frequency</td>
                            <td>{frequency.toUpperCase()}</td>
                          </tr>
                          <tr style={tableTr}>
                            <td>Start Date</td>
                            <td>{formatDate(recurring_start_date)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="w-35-md rcr-transition-info rcr-transition-info-2">
                      <table>
                        <tbody>
                          <tr style={tableTr}>
                            <td>Scheduled Date</td>
                            <td>{formatDate(schedule_date)}</td>
                          </tr>
                          <tr style={tableTr}>
                            <td>End Date</td>
                            <td>{formatDate(recurring_end_date)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="jar-wcr-info">
                    <span>Specifications</span>
                    <p>{specifications}</p>
                  </div>{" "}
                </div>
              </div>
              <div className="jar-rc-refund-second-wrap">
                <div
                  className="rc-refund-main-inner section-recurring-dates"
                  style={{ scrollbarColor: "#7f8c8d #f4fcfe" }}
                >
                  <div className="d-flex flex-wrap w-100">
                    <div className="w-100-md rcr-transition-info rcr-transition-info-1">
                      <table>
                        <thead className="freq-date-header">
                          <tr>
                            <th>Frequency Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recurring_dates?.length === 0 ? (
                            <tr
                              style={{ textAlign: "center", height: "300px" }}
                            >
                              <td colSpan="3" className="border-0">
                                No data found
                              </td>
                            </tr>
                          ) : (
                            recurring_dates?.map((dateEntry, index) => {
                              const recurringType =
                                recurringTypeStatus[
                                  dateEntry?.status.toLowerCase()
                                ];
                              return (
                                <tr key={index}>
                                  <td className="text-black">
                                    {formatDate(dateEntry.date)}
                                  </td>
                                  <td>
                                    <div
                                      className={`act-amt-wrap cx-color-green p-0`}
                                    >
                                      <WrapAmount
                                        value={dateEntry.amount}
                                        prefix={`${CURRENCY_SYMBOL} `}
                                      />
                                    </div>
                                  </td>
                                  <td className="freq-date-rec-td border-0 pt-2 pb-2">
                                    <div
                                      className={recurringType?.className || ""}
                                    >
                                      {recurringType?.status ||
                                        dateEntry?.status?.toUpperCase()}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-center mt-3">
              <button
                type="button"
                className="outline-btn justify-content-center"
                onClick={() => handleAcceptOrDecline(0, details)}
                style={{ minWidth: "204px" }}
              >
                Decline
              </button>
              <button
                type="button"
                className="btn print-details-btn"
                onClick={() => handleAcceptOrDecline(1, details)}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRecurringPaymentDetails;
