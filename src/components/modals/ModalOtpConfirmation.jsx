import React, { useEffect, useState, useRef } from "react";
import InputOtp from "components/ui/InputOtp";
import { otpCounterTime } from "constants/all";
import { useFormik } from "formik";
import styles from "./modal.module.scss";

function ModalOtpConfirmation(props) {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    heading,
    headingImg,
    subHeading,
    handleSubmitOtp,
    handleResendOtp,
    validationSchema,
    allowClickOutSide,
  } = props;
  const modalRef = useRef(null);

  const [counter, setCounter] = useState(otpCounterTime);
  const [isActive, setIsActive] = useState(true);

  const resendOtp = async () => {
    try {
      setIsActive(false);
      await handleResendOtp();
      setCounter(otpCounterTime);
      setIsActive(true);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (!show) {
      setIsActive(false);
      setCounter(otpCounterTime);
      return;
    }
    setIsActive(true);
  }, [show]);

  // For set counter for given time
  useEffect(() => {
    let interval = null;
    if (isActive)
      interval = setInterval(() => {
        setCounter((counter) => (counter - 1 > 0 ? counter - 1 : 0));
      }, 1000);
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  // For stop counter when timeout
  useEffect(() => {
    if (counter <= 0) setIsActive(false);
  }, [counter]);

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
  }, [modalRef, setShow]);

  // OTP input form
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setValues }) => {
      try {
        const result = await handleSubmitOtp(values.otp);
        if (!result) return setValues({ otp: "" });
        setIsActive(false);
        setShow(false);
        resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  let formattedNumber = (counter % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let counterTime =
    Math.floor(counter / 60) + ":" + (formattedNumber ? formattedNumber : "00");

  if (!show) return;
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
                <img src={headingImg} alt="otp img" />
              </div>
            </div>
            <div className="modal-body">
              <h3>{heading}</h3>
              <p>{subHeading}</p>
              <form
                className="login-otp-numbers"
                onSubmit={formik.handleSubmit}
              >
                <div className="form-field">
                  <InputOtp
                    otpSize={4}
                    name="otp"
                    className={"form-control"}
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    handleSubmit={formik.handleSubmit}
                    error={formik.touched.otp && formik.errors.otp}
                  />
                </div>
                <div className="resend-otp-wrap">
                  {isActive && (
                    <div>
                      <span>{counterTime}</span>
                      <br />
                    </div>
                  )}
                  <p>Didn't receive any code?</p>
                  <button
                    type="button"
                    className={isActive ? "disabled" : ""}
                    disabled={isActive}
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </button>
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
                    value="Verify"
                    disabled={formik.isSubmitting}
                  />
                </div>
                <div className="pop-cancel-btn text-center">
                  <button onClick={() => setShow(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalOtpConfirmation;
