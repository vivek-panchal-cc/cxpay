import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "./modal.module.scss";
import {
  TXN_TYPE_SJ,
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
  isAdminApprovedWithRenewCheck,
  ACT_STATUS_FAILED,
  TXN_TYPE_WW,
  getInitials,
  getRandomColorClass,
} from "constants/all";
import LoaderActivityDetail from "loaders/LoaderActivityDetail";
import LoaderActivityProfile from "loaders/LoaderActivityProfile";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDate } from "helpers/commonHelpers";
import { IconCloseModal } from "styles/svgs";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { SendPaymentContext } from "context/sendPaymentContext";

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
    fees,
    net_amount,
    payment_type,
    ref_id,
  } = details || {};

  const modalRef = useRef(null);
  const [payAgain, setPayAgain] = useState(false);
  const profileUrl = image || "/assets/images/single_contact_profile.png";
  const { admin_approved, user_type } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const { setIsLoading } = useContext(LoaderContext);
  const { handleSendContactsForInstantPay } = useContext(SendPaymentContext);

  const statusKey = useMemo(() => {
    return user_type === "business" && status === ACT_STATUS_PAID
      ? `${status}_business`
      : status;
  }, [user_type, status]);

  const trWwStatus = useMemo(
    () =>
      activity_type === ACT_TYPE_TRANSACTION &&
      (request_type === ACT_TRANSACT_CREDIT ||
        request_type === ACT_TRANSACT_DEBIT) &&
      txn_type === TXN_TYPE_WW,
    [activity_type, request_type, txn_type]
  );

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
          activityConsts[activity_type]?.[request_type]?.[txn_type]?.[
            trWwStatus ? statusKey : status
          ] || {}
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
    if (
      activity_type === ACT_TYPE_TRANSACTION &&
      (request_type === ACT_TRANSACT_CREDIT ||
        request_type === ACT_TRANSACT_DEBIT) &&
      status === ACT_STATUS_PAID &&
      txn_type === TXN_TYPE_SJ
    ) {
      return null;
    }

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
            {adminApprovedWithRenewCheck ? (
              <button
                type="button"
                className="outline-btn w-50 d-block"
                onClick={() => handleCancel(details)}
              >
                Decline
              </button>
            ) : (
              <button
                type="button"
                className="outline-btn w-50 d-block contacts-admin-approved-disabled"
              >
                Decline
              </button>
            )}
            {adminApprovedWithRenewCheck ? (
              <button
                type="button"
                className="btn print-details-btn w-50"
                onClick={() => handleSubmit(details)}
              >
                Accept
              </button>
            ) : (
              <button
                type="button"
                className="outline-btn w-50 d-block contacts-admin-approved-disabled"
              >
                Accept
              </button>
            )}
          </>
        );
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_DEBIT}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PENDING}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_REJECTED}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_APPROVED}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_DEBIT}_${ACT_STATUS_FAILED}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_FAILED}`:
        return (
          <button
            type="button"
            className="btn print-details-btn w-50"
            onClick={() => handleSubmit(details)}
          >
            Download Details
          </button>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (ACT_TRANSACT_DEBIT === request_type && TXN_TYPE_WW === txn_type) {
      setPayAgain(true);
    } else {
      setPayAgain(false); // Optionally reset if conditions don't match
    }
  }, [request_type, txn_type]);

  const handlePayAgain = async () => {
    if (!ref_id) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.walletTransactionVerify({
        ref_id: ref_id,
      });
      if (!data.success) throw data.message;
      const details = data.data;
      const contact = {
        name: details.name,
        profile_image: details.image,
        specifications: details.specification,
        personal_amount:
          typeof details.amount === "number" ? details.amount?.toFixed(2) : "0",
        receiver_account_number: details.receiver_account_number,
        user_type: details.user_type,
        merchant_fees: details.merchant_fees,
      };
      handleSendContactsForInstantPay([contact], ref_id);
      // toast.success(data.message);
      setShow(false);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
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
                <IconCloseModal
                  style={{
                    position: "absolute",
                    top: "100px",
                    right: "30px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShow(false)}
                />{" "}
                {loading ? (
                  <LoaderActivityProfile />
                ) : image ? (
                  // <img src={profileUrl} alt="User Profile" />
                  <img src={image} className="blue-bg" alt="" />
                ) : (
                  <div
                    className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                      name
                    )}`}
                  >
                    {getInitials(name)}
                  </div>
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
                        prefix={`${CURRENCY_SYMBOL} ${
                          iconAmount === "-" ? "" : iconAmount
                        }`}
                      />
                    </p>
                    <p>{specification}</p>
                  </div>
                  {payAgain && (
                    <div className="act-status-wrap mt-3 d-flex justify-content-center">
                      <button
                        type="button"
                        className={`btn btn-blue`}
                        onClick={handlePayAgain}
                      >
                        Recreate
                      </button>
                    </div>
                  )}
                  <table>
                    <tbody>
                      {fees != null && Number(fees) > 0 && (
                        <tr>
                          <td>Fees</td>
                          <td>
                            <WrapAmount
                              value={fees}
                              prefix={`${CURRENCY_SYMBOL} `}
                            />
                          </td>
                        </tr>
                      )}
                      {fees != null &&
                        Number(fees) > 0 &&
                        net_amount != null &&
                        Number(net_amount) > 0 && (
                          <tr>
                            <td>Net Amount</td>
                            <td>
                              <WrapAmount
                                value={net_amount}
                                prefix={`${CURRENCY_SYMBOL} `}
                              />
                            </td>
                          </tr>
                        )}

                      <tr>
                        <td>Date</td>
                        <td>{formatDate(date)}</td>
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
                    {/* <button
                      type="button"
                      className="btn close-btn"
                      style={{ minWidth: "200px" }}
                      onClick={() => setShow(false)}
                    >
                      Close
                    </button> */}
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
