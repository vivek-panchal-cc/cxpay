import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import { CURRENCY_SYMBOL } from "constants/all";

const ModalActivityDetail = (props) => {
  const { children, className, classNameChild, id, show, setShow } = props;
  const {
    amount,
    date,
    image,
    mobile_number,
    paid_from,
    paid_to,
    specification,
    status,
  } = props.details || {};
  const modalRef = useRef(null);

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

  if (!show) return;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <div class="user-profile-div">
                <img src={image} alt="User Profile" />
              </div>
            </div>
            <div class="modal-body">
              <h3>Belasti ngd ienst</h3>
              <div class="loan-amount">
                <p>
                  {amount} <span>{CURRENCY_SYMBOL}</span>
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
                  <td class="highlight">{status}</td>
                </tr>
                <tr>
                  <td>Paid From</td>
                  <td>{paid_from}</td>
                </tr>
                <tr>
                  <td>Paid To</td>
                  <td>{paid_to}</td>
                </tr>
              </table>
              <div class="text-center">
                <a class="btn print-details-btn" data-bs-dismiss="modal">
                  Print Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActivityDetail;
