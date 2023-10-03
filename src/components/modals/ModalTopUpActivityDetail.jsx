import React, { useEffect, useMemo, useRef } from "react";
import styles from "./modal.module.scss";
import {
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  activityConsts,
} from "constants/all";
import LoaderActivityDetail from "loaders/LoaderActivityDetail";
import LoaderActivityProfile from "loaders/LoaderActivityProfile";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDate } from "helpers/commonHelpers";

const ModalTopUpActivityDetail = (props) => {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    handleSubmit,
    details,
    loading,
  } = props;

  const {
    customer_name,
    topup_amount,
    date,
    profile_image,
    customer_mobile_number,
    txn_type,
    status,
    specification,
    activity_type,
    request_type,
    topup_type,
    card_name,
    topup_ref_id,
    agent_commission,
    card_commission,
    system_commission,
  } = details || {};  

  const modalRef = useRef(null);
  const profileUrl =
    profile_image || "/assets/images/single_contact_profile.png";

  const totalCommission = useMemo(() => {
    return (
      (parseFloat(agent_commission) || 0) +
      (parseFloat(card_commission) || 0) +
      (parseFloat(system_commission) || 0)
    );
  }, [agent_commission, card_commission, system_commission]);

  const { classBg, classDetailStatus } = useMemo(() => {
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
    return (
      <button
        type="button"
        className="btn print-details-btn w-50"
        onClick={() => handleSubmit(details)}
      >
        Print Details
      </button>
    );
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
                  <h3>{customer_name}</h3>
                  <div className={`loan-amount ${classBg}`}>
                    <p>
                      <WrapAmount
                        value={topup_amount}
                        // prefix={`${CURRENCY_SYMBOL} ${iconAmount}`}
                      />
                    </p>
                    <p>{specification}</p>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>Date</td>
                        <td>{formatDate(date)}</td>
                      </tr>
                      {customer_mobile_number && (
                        <tr>
                          <td>Mobile Number</td>
                          <td>
                            <span className={classDetailStatus}>
                              +{customer_mobile_number}
                            </span>
                          </td>
                        </tr>
                      )}
                      {topup_ref_id && (
                        <tr>
                          <td>Reference Id</td>
                          <td>{topup_ref_id}</td>
                        </tr>
                      )}
                      {topup_type && (
                        <tr>
                          <td>Payment Type</td>
                          <td>
                            {topup_type}
                            {topup_type.toLowerCase() === "card" && card_name
                              ? " - " + card_name
                              : ""}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>Total Commission</td>
                        <td>{totalCommission}</td>
                      </tr>
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

export default ModalTopUpActivityDetail;
