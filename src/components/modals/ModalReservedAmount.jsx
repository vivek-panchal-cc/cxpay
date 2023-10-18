import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import { CURRENCY_SYMBOL } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDateToDesiredFormat } from "helpers/commonHelpers";
import { IconManualWithdraw, IconSchedulePayment } from "styles/svgs";
import LoaderActivityItem from "loaders/LoaderActivityItem";

const ModalReservedAmount = (props) => {
  const { className, classNameChild, id, show, setShow, details, loading } =
    props;

  const modalRef = useRef(null);

  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        if (setShow) setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

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
              <h5>Reserved Amount</h5>
              <div class="res-data-wrap">
                {[1, 2, 3, 4, 5]?.map((item) => (
                  <LoaderActivityItem key={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`modal rese-modal-wrap fade show ${styles.modal} ${className}`}
      id={id}
    >
      <div ref={modalRef} className={classNameChild} style={{ width: "70%" }}>
        <div className="modal-dialog-reserved-amount modal-dialog-centered">
          <div className="modal-content">
            <h5>Reserved Amount</h5>
            <div class="res-data-wrap">
              {Array.isArray(details) && details.length > 0 ? (
                details?.map((detail) => (
                  <React.Fragment key={detail.date}>
                    <div className="act-info-wrap-left">
                      <div className="act-user-info-wrap d-flex">
                        <div className="act-user-thumb">
                          <img
                            src={
                              detail.image ||
                              "/assets/images/single_contact_profile.png"
                            }
                            alt="User Profile"
                          />
                        </div>

                        <div className="act-user-in">
                          <h2>{detail.name}</h2>
                          {/* <p>{formatDate(detail.date)}</p> */}
                        </div>
                      </div>
                      <div className={`act-amt-wrap mobile-amt`}>
                        <WrapAmount
                          value={detail.amount}
                          prefix={`${CURRENCY_SYMBOL} `}
                        />
                        &nbsp;
                        {"+"}&nbsp;
                        <WrapAmount
                          value={detail.fees}
                          prefix={`${CURRENCY_SYMBOL} `}
                        />
                        &nbsp;
                        <span
                          style={{
                            textTransform: "none",
                            fontWeight: "normal",
                          }}
                        >
                          (Fees)
                        </span>
                      </div>
                      <div className="act-specification-text p-0">
                        <p>{formatDateToDesiredFormat(detail.date)}</p>
                      </div>
                      <div className="modal-body">
                        <>
                          <div className={`act-amt-wrap desk-amt text-end`}>
                            <WrapAmount
                              value={detail.amount}
                              prefix={`${CURRENCY_SYMBOL} `}
                            />
                            &nbsp;
                            {"+"}&nbsp;
                            <WrapAmount
                              value={detail.fees}
                              prefix={`${CURRENCY_SYMBOL} `}
                            />
                            &nbsp;
                            <span
                              style={{
                                textTransform: "none",
                                fontWeight: "normal",
                              }}
                            >
                              (Fees)
                            </span>
                          </div>
                          <div className="act-specification-text">
                            <p className={`${detail.transaction_type}`}>
                              {detail.transaction_type?.toLowerCase() ===
                              "withdraw" ? (
                                <IconManualWithdraw />
                              ) : (
                                <IconSchedulePayment />
                              )}
                              {detail.transaction_type?.toLowerCase() ===
                              "withdraw"
                                ? "Manual Withdraw"
                                : "Schedule Payment"}
                            </p>
                          </div>
                        </>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-4 d-flex justify-content-center">
                  <p className="fs-5">Reserved amount not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalReservedAmount;
