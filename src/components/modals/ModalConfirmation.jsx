import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";

function ModalConfirmation(props) {
  const {
    children,
    className,
    classNameChild,
    id,
    show,
    setShow,
    handleCallback,
    heading = "Confirm",
    subHeading = "",
    error = "",
  } = props;
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

  if (!show) return null;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className} del-modal-main`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header flex-column">
              <h3 className="text-center">{heading}</h3>
              <p>{subHeading}</p>
              {error ? (
                <p className="text-danger text-center">{error}</p>
              ) : null}
            </div>
            <div className="modal-body">
              <div>{children}</div>
              <div className="popup-btn-wrap d-flex align-items-center justify-content-center gap-4">
                <button
                  type="button"
                  className="outline-btn px-4"
                  style={{ minWidth: "initial" }}
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                {!error ? (
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-3"
                    style={{ minWidth: "initial" }}
                    onClick={handleCallback}
                  >
                    confirm
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmation;
