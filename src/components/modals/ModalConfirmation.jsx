import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";

function ModalConfirmation(props) {
  const { children, className, id, show, setShow, header = "Confirm" } = props;
  const modalRef = useRef(null);

  useEffect(() => {
    function handleclickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

  if (!show) return null;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>{header}</h3>
          </div>
          <div className="modal-body">
            <div>{children}</div>
            <div className="popup-btn-wrap d-flex align-items-center gap-4">
              <button
                type="button"
                className="outline-btn px-4 py-3"
                style={{ minWidth: "initial" }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary px-4 py-3"
                style={{ minWidth: "initial" }}
              >
                confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmation;
