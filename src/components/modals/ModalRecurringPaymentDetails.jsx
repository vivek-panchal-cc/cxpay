import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import {
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
  reservedAmountType,
} from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDateToDesiredFormat } from "helpers/commonHelpers";
import { IconCloseModal } from "styles/svgs";
import LoaderRecurringCards from "loaders/LoaderRecurringCards";

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
  } = props;

  const modalRef = useRef(null);

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
                  top: "30px",
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
      className={`modal rese-modal-wrap fade show ${styles.modal} ${className}`}
      id={id}
    >
      <div ref={modalRef} className={classNameChild} style={{ width: "70%" }}>
        <div className="modal-dialog-reserved-amount modal-dialog-centered">
          <div className="modal-content" style={{ position: "relative" }}>
            <IconCloseModal
              style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                cursor: "pointer",
              }}
              onClick={() => setShow(false)}
            />{" "}
            <div className="res-data-wrap">
              {Array.isArray(details) && details.length > 0 ? (
                details?.map((detail, index) => (
                  <React.Fragment key={`${detail.date}${index}`}>
                    <div className="act-info-wrap-left">
                      <div className="act-user-info-wrap d-flex">
                        <div className="act-user-thumb">
                          {/* <img
                            src={
                              detail.image ||
                              "/assets/images/single_contact_profile.png"
                            }
                            alt="User Profile"
                          /> */}
                          {detail.image ? (
                            <img
                              src={detail.image}
                              className="blue-bg"
                              alt=""
                            />
                          ) : (
                            <div
                              className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                                detail?.name
                              )}`}
                            >
                              {getInitials(detail?.name)}
                            </div>
                          )}
                        </div>

                        <div className="act-user-in">
                          <h2>{detail.name}</h2>
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
                            <p
                              className={
                                reservedAmountType[detail.transaction_type]
                                  ?.classText
                              }
                            >
                              {
                                reservedAmountType[detail.transaction_type]
                                  ?.icon
                              }
                              {
                                reservedAmountType[detail.transaction_type]
                                  ?.label
                              }
                            </p>
                          </div>
                        </>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-4 d-flex justify-content-center">
                  <p className="fs-5">Recurring details not found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRecurringPaymentDetails;
