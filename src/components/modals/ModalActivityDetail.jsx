import React, { useEffect, useMemo, useRef } from "react";
import styles from "./modal.module.scss";
import {
  ACT_REQUEST_RECEIVE,
  ACT_REQUEST_SEND,
  ACT_STATUS_PAID,
  ACT_STATUS_PENDING,
  ACT_TRANSACT_CREDIT,
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import LoaderActivityDetail from "loaders/LoaderActivityDetail";
import LoaderActivityProfile from "loaders/LoaderActivityProfile";

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
    loading,
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
    activity_type,
    request_type,
  } = details || {};

  const modalRef = useRef(null);
  const profileUrl = image || "/assets/images/single_contact_profile.png";

  const {
    iconStatus,
    iconAmount,
    classStatus,
    classBg,
    classText,
    textStatus,
  } = useMemo(() => {
    if (!activity_type) return {};
    switch (activity_type) {
      case ACT_TYPE_REQUEST:
        return activityConsts[activity_type]?.[request_type]?.[status] || {};
      case ACT_TYPE_TRANSACTION:
        return activityConsts[activity_type]?.[request_type]?.[status] || {};
      default:
        return {};
    }
  }, [activity_type, request_type, status]);

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
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PENDING}`:
        return (
          <button
            type="button"
            className="outline-btn w-50 d-block"
            onClick={() => handleCancel(details)}
          >
            Cancel Request
          </button>
        );
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
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
              Accept
            </button>
          </>
        );
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PAID}`:
        return (
          <button
            type="button"
            className="btn print-details-btn w-50"
            onClick={() => {}}
          >
            Print Details
          </button>
        );
    }
  };

  if (!show) return;
  return (
    <div className={`modal fade show ${styles.modal} ${className}`} id={id}>
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="user-profile-div bg-white">
                {loading ? (
                  <LoaderActivityProfile />
                ) : (
                  <img src={profileUrl} alt="User Profile" />
                )}
              </div>
            </div>
            <div className="modal-body">
              {loading ? (
                <LoaderActivityDetail />
              ) : (
                <>
                  <h3>{name}</h3>
                  <div className={`loan-amount ${classBg}`}>
                    <p>
                      <span className={`${classText}`}>{CURRENCY_SYMBOL}</span>
                      <span className={`ms-1 ${classText}`}>
                        {iconAmount}
                        {amount}
                      </span>
                    </p>
                    <p>{specification}</p>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>Date</td>
                        <td>{date}</td>
                      </tr>
                      {activity_type === ACT_TYPE_REQUEST && (
                        <tr>
                          <td>Status</td>
                          <td>{status}</td>
                        </tr>
                      )}
                      {request_from && (
                        <tr>
                          <td>Request From</td>
                          <td>{request_from}</td>
                        </tr>
                      )}
                      {paid_to && (
                        <tr>
                          <td>
                            {activity_type === ACT_TYPE_REQUEST
                              ? "Request To"
                              : "Paid To"}
                          </td>
                          <td>{paid_to}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex gap-3 justify-content-center">
                    {getActivityActions()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActivityDetail;
