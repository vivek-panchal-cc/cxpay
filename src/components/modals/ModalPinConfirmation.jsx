import React, { useEffect, useState, useRef } from "react";
import InputPin from "components/ui/InputPin";
import { useFormik } from "formik";
import styles from "./modal.module.scss";

function ModalPinConfirmation(props) {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    heading,
    headingImg,
    subHeading,
    handleSubmitPin,
    validationSchema,
    allowClickOutSide,
  } = props;

  const modalRef = useRef(null);
  const pinInputRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  // For closing the modal on click of outside the modal area
  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        !allowClickOutSide && setShow && setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow, allowClickOutSide]);

  useEffect(() => {
    if (show && pinInputRef.current) {
      pinInputRef.current.focus(); // Set focus to the first pin input field when modal opens
    }
  }, [show]);

  const formik = useFormik({
    initialValues: {
      pin: "",
      confirm_pin: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setValues, setErrors }) => {      
      try {
        const result = await handleSubmitPin(values.pin, values.confirm_pin);
        if (!result) throw result;
        setIsActive(false);
        setShow(false);
        resetForm();
      } catch (error) {
        resetForm();
        console.log(error);
      }
    },
  });

  if (!show) return null;
  return (
    <div
      className={`test modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="">
                <img src={headingImg} alt="pin img" />
              </div>
            </div>
            <h3 className="text-center">{heading}</h3>
            <p className="text-center">{subHeading}</p>
            <div className="modal-body">
              <form
                className="login-otp-numbers"
                onSubmit={formik.handleSubmit}
              >
                <label className="mb-3 w-100 text-center">
                  Please enter your unique PIN
                </label>
                <div className="form-field">
                  <InputPin
                    pinSize={5}
                    name="pin"
                    className={"form-control"}
                    value={formik.values.pin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isSubmitting={formik.isSubmitting}
                    handleSubmit={!formik.isSubmitting && formik.handleSubmit}
                    error={formik.touched.pin && formik.errors.pin}
                    ref={pinInputRef}
                  />
                </div>

                <label className="mb-3 w-100 text-center">
                  Please confirm your unique PIN
                </label>
                <div className="form-field">
                  <InputPin
                    pinSize={5}
                    name="confirm_pin"
                    className={"form-control"}
                    value={formik.values.confirm_pin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isSubmitting={formik.isSubmitting}
                    handleSubmit={!formik.isSubmitting && formik.handleSubmit}
                    error={
                      formik.touched.confirm_pin && formik.errors.confirm_pin
                    }
                  />
                </div>
                <div className="popup-btn-wrap">
                  {formik.status && (
                    <p className="text-danger">{formik.status}</p>
                  )}
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    value="Set PIN"
                    disabled={formik.isSubmitting}
                  />
                </div>
                <div className="pop-cancel-btn text-center">
                  <button type="button" onClick={() => {
                    formik.resetForm();
                    setShow(false)
                    }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPinConfirmation;
