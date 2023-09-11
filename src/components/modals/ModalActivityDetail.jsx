import React, { useEffect, useMemo, useRef } from "react";
import styles from "./modal.module.scss";
import {
  ACT_REQUEST_RECEIVE,
  ACT_REQUEST_SEND,
  ACT_STATUS_APPROVED,
  ACT_STATUS_PAID,
  ACT_STATUS_PENDING,
  ACT_STATUS_REJECTED,
  ACT_TRANSACT_CREDIT,
  ACT_TRANSACT_DEBIT,
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  TXN_TYPE_AGENT,
  CURRENCY_SYMBOL,
  activityConsts,
} from "constants/all";
import LoaderActivityDetail from "loaders/LoaderActivityDetail";
import LoaderActivityProfile from "loaders/LoaderActivityProfile";
import WrapAmount from "components/wrapper/WrapAmount";

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
    paid_date,
    image,
    mobile_number,
    request_from,
    paid_to,
    txn_type,
    status,
    specification,
    activity_type,
    request_type,
    comment,
    txn_mode,
    payment_type,
  } = details || {};

  const modalRef = useRef(null);
  const profileUrl = image || "/assets/images/single_contact_profile.png";

  const {
    iconStatus,
    iconAmount,
    classStatus,
    classBg,
    classText,
    classDetailStatus,
    textStatus,
    textDetailStatus,
  } = useMemo(() => {
    if (!activity_type) return {};
    switch (activity_type) {
      case ACT_TYPE_REQUEST:
        return activityConsts[activity_type]?.[request_type]?.[status] || {};
      case ACT_TYPE_TRANSACTION:
        return (
          activityConsts[activity_type]?.[request_type]?.[txn_type]?.[status] ||
          {}
        );
      default:
        return {};
    }
  }, [activity_type, request_type, status]);

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
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_DEBIT}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PENDING}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_REJECTED}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_APPROVED}`:
        return (
          <button
            type="button"
            className="btn print-details-btn w-50"
            onClick={() => handleSubmit(details)}
          >
            Print Details
          </button>
        );
      default:
        return null;
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
                      <WrapAmount
                        value={amount}
                        prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
                      />
                    </p>
                    <p>{specification}</p>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>Date</td>
                        <td>{date}</td>
                      </tr>
                      {request_type === ACT_REQUEST_SEND &&
                        status === ACT_STATUS_PAID && (
                          <tr>
                            <td>Paid date</td>
                            <td>{paid_date}</td>
                          </tr>
                        )}
                      <tr>
                        <td>Status</td>
                        <td>
                          <span className={classDetailStatus}>
                            {textDetailStatus || status}
                          </span>
                        </td>
                      </tr>
                      {txn_type === TXN_TYPE_AGENT && txn_mode && (
                        <tr>
                          <td>Payment Type</td>
                          <td>{txn_mode}</td>
                        </tr>
                      )}
                      {request_from && (
                        <tr>
                          <td>
                            {(request_type === ACT_REQUEST_SEND &&
                              status === ACT_STATUS_PAID) ||
                            (request_type === ACT_TRANSACT_CREDIT &&
                              status === ACT_STATUS_PAID)
                              ? "Receive From"
                              : "Request From"}
                          </td>
                          <td>{request_from}</td>
                        </tr>
                      )}
                      {paid_to && (
                        <tr>
                          <td>
                            {activity_type === ACT_TYPE_REQUEST
                              ? "Request To"
                              : "Sent To"}
                          </td>
                          <td>{paid_to}</td>
                        </tr>
                      )}
                      {comment && (
                        <tr>
                          <td>Comment</td>
                          <td>{comment}</td>
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
