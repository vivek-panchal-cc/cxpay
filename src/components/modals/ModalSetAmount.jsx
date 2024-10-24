import Input from "components/ui/Input";
import React, { useEffect, useRef, useState } from "react";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { useFormik } from "formik";
import styles from "./modal.module.scss";
import { setQrAmount } from "schemas/validationSchema";

function ModalSetAmount(props) {
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

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: setQrAmount,
    onSubmit: (values) => {
      handleCallback(values.amount);
    },
  });

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

  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
  }, [show]);

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
              <form onSubmit={formik.handleSubmit}>
                <div className="form-field">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Enter amount"
                    name="amount"
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e); // Pass the event to formik.handleBlur
                    }}
                    value={formik.values.amount}
                    error={formik.touched.amount && formik.errors.amount}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                </div>

                <div className="popup-btn-wrap d-flex align-items-center justify-content-center gap-4">
                  <button
                    type="button"
                    className="outline-btn px-4"
                    style={{ minWidth: "initial" }}
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>
                  {/* {!error ? ( */}
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-3"
                    style={{ minWidth: "initial" }}
                    // onClick={handleCallback}
                    disabled={formik.values.amount?.length === 0}
                    autoFocus={true}
                  >
                    Set
                  </button>
                  {/* ) : null} */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalSetAmount;
