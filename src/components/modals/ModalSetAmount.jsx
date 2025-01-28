import Input from "components/ui/Input";
import React, { useEffect, useRef, useState } from "react";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { useFormik } from "formik";
import styles from "./modal.module.scss";
import { setQrAmount } from "schemas/validationSchema";
import { CURRENCY_SYMBOL } from "constants/all";

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

  // const formik = useFormik({
  //   initialValues: {
  //     amount: "",
  //   },
  //   validationSchema: setQrAmount,
  //   onSubmit: (values) => {
  //     handleCallback(values.amount);
  //   },
  // });

  const formik = useFormik({
    initialValues: {
      amount: "",
      specification: "",
    },
    validationSchema: setQrAmount,
    onSubmit: (values) => {
      let formattedValue = values.amount;

      // Check if the value has a decimal point
      if (!formattedValue.includes(".")) {
        formattedValue += ".00"; // Add .00 if no decimal exists
      } else {
        const [integerPart, decimalPart] = formattedValue.split(".");

        if (decimalPart.length === 1) {
          formattedValue = `${integerPart}.${decimalPart}0`; // Add 0 if only one decimal place exists
        }
      }

      // Update the formik value and trigger callback with formatted amount
      formik.setFieldValue("amount", formattedValue);
      handleCallback(formattedValue, values.specification);
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
    // <div>
    <div
      className={`modal fade show ${styles.modal} ${className} del-modal-main`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered justify-content-center">
          <div className="modal-content" style={{ width: "90%" }}>
            <div className="modal-header flex-column">
              <h3 className="text-center">{heading}</h3>
              <p>{subHeading}</p>
              {error ? (
                <p className="text-danger text-center">{error}</p>
              ) : null}
            </div>
            <div className="">
              <div>{children}</div>
              <div className="d-flex justify-content-center">
                <form onSubmit={formik.handleSubmit}>
                  <div className="input-select-wrap form-field">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="0.00"
                      name="amount"
                      autoFocus={true}
                      autoComplete="off"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimals

                        // Prevent more than one decimal point
                        const decimalCount = (value.match(/\./g) || []).length;
                        if (decimalCount > 1) {
                          value = value.slice(0, -1); // Remove extra decimal point
                        }

                        // Allow only up to 6 digits before the decimal point
                        const [integerPart, decimalPart] = value.split(".");
                        if (integerPart.length <= 6) {
                          if (decimalPart && decimalPart.length > 2) {
                            // Limit to two decimal places
                            formik.setFieldValue(
                              "amount",
                              integerPart + "." + decimalPart.slice(0, 2)
                            );
                          } else {
                            formik.setFieldValue("amount", value);
                          }
                        } else {
                          formik.setFieldValue(
                            "amount",
                            integerPart.slice(0, 6) +
                              (decimalPart ? `.${decimalPart.slice(0, 2)}` : "")
                          );
                        }
                      }}
                      value={formik.values.amount}
                      error={formik.touched.amount && formik.errors.amount}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <p className="ip_currancy">{CURRENCY_SYMBOL}</p>
                  </div>
                  <div className="col-12 col p-0">
                    <div className="form-field">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Specification"
                        name="specification"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.specification}
                        error={
                          formik.touched.specification &&
                          formik.errors.specification
                        }
                      />
                    </div>
                  </div>
                  <div className="popup-btn-wrap d-flex align-items-center justify-content-end gap-4 mt-3">
                    <div className="set-amount">
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
                        className={`outline-btn px-4 py-3 ${
                          formik.values.amount?.length === 0 ||
                          !formik.values.specification
                            ? "disabled-font-color"
                            : ""
                        }`}
                        style={{ minWidth: "initial" }}
                        // onClick={handleCallback}
                        disabled={
                          formik.values.amount?.length === 0 ||
                          !formik.values.specification
                        }
                        autoFocus={true}
                      >
                        OK
                      </button>
                    </div>
                    {/* ) : null} */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default ModalSetAmount;
