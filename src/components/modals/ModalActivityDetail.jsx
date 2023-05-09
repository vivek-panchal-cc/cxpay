import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import { CURRENCY_SYMBOL, activityType } from "constants/all";

const ModalActivityDetail = (props) => {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    handleCancel,
    handleSubmit,
    details,
  } = props;

  const {
    name,
    amount,
    date,
    image,
    mobile_number,
    request_from,
    paid_to,
    specification,
    status,
    request_type,
  } = details || {};

  const modalRef = useRef(null);
  const profileUrl = image || "/assets/images/single_contact_profile.png";
  const classBg = activityType?.[request_type]?.[status]?.classBg || "";
  const classText = activityType?.[request_type]?.[status]?.classText || "";
  const textStatus = activityType?.[request_type]?.[status]?.textStatus || "";
  const iconStatus = activityType?.[request_type]?.[status]?.iconStatus || "";
  const iconAmount = activityType?.[request_type]?.[status]?.iconAmount || "";

  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        setShow && setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

  const getActivityActions = () => {
    switch (`${request_type}_${status}`) {
      case "send_PENDING":
        return (
          <button
            type="button"
            className="outline-btn w-50 d-block"
            onClick={() => handleCancel(details)}
          >
            Cancel Request
          </button>
        );
      case "receive_PENDING":
        return (
          <>
            <button
              type="button"
              className="outline-btn w-50 d-block"
              onClick={() => handleCancel(details)}
            >
              Decline
            </button>
            <button
              type="button"
              className="btn print-details-btn w-50"
              onClick={() => handleSubmit(details)}
            >
              Pay
            </button>
          </>
        );
    }
  };

  if (!show) return;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="user-profile-div bg-white">
                <img src={profileUrl} alt="User Profile" />
              </div>
            </div>
            <div className="modal-body">
              <h3>{name}</h3>
              <div className={`loan-amount ${classBg}`}>
                <p>
                  <span className={`${classText}`}>{amount}</span>
                  <span className={`ms-1 ${classText}`}>{CURRENCY_SYMBOL}</span>
                </p>
                <p>{specification}</p>
              </div>
              <table>
                <tr>
                  <td>Date</td>
                  <td>{date}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{status}</td>
                </tr>
                <tr>
                  <td>Request From</td>
                  <td>{request_from}</td>
                </tr>
                <tr>
                  <td>Paid To</td>
                  <td>{paid_to}</td>
                </tr>
              </table>
              <div className="d-flex gap-3 justify-content-center">
                {getActivityActions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActivityDetail;
