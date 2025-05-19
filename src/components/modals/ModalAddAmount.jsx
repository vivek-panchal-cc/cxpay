import Input from "components/ui/Input";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import styles from "./modal.module.scss";
import { CURRENCY_SYMBOL, handleWholeNumberInputChange } from "constants/all";
import { setAmount } from "schemas/jarSchema";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalDatePickerKyc from "./ModalDatePickerKyc";

function ModalAddAmount(props) {
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
    values,
    minAmount,
    minDate,
    maxDate,
  } = props;
  const { installment_amount, recurring_date } = values || {};
  const [datePicker, setDatePicker] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: installment_amount
        ? String(parseInt(installment_amount, 10))
        : "",
      recurring_date: recurring_date || "",
    },
    validationSchema: setAmount,
    onSubmit: (values) => {
      const parsedAmount = parseFloat(values.amount);
      if (minAmount && parsedAmount > parseFloat(minAmount)) {
        formik.setFieldError("amount", `Amount should not exceed ${minAmount}`);
        return;
      }

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
      // handleCallback(formattedValue);
      handleCallback({
        amount: formattedValue,
        recurring_date: values.recurring_date,
      });
    },
  });

  const handleChangeDateFilter = (date) => {
    if (datePicker && date instanceof Date && !isNaN(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`; // yyyy-mm-dd in local time
      formik.setFieldValue("recurring_date", formattedDate);
    }
    setDatePicker("");
  };

  useEffect(() => {
    if (recurring_date) {
      const today = new Date();
      const inputDate = new Date(recurring_date);

      // Set time to 0 to compare only date parts
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        // Format today as yyyy-mm-dd
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedToday = `${year}-${month}-${day}`;
        formik.setFieldValue("recurring_date", formattedToday);
      }
    }
  }, [recurring_date, show]);

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
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

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
        <div className="modal-dialog modal-dialog-centered justify-content-center">
          <div className="modal-content" style={{ width: "90%" }}>
            <div className="modal-header flex-column">
              <h3 className="text-center">{heading}</h3>
              <p>{subHeading}</p>
            </div>
            <div className="">
              <div>{children}</div>
              <div className="d-flex justify-content-center">
                <form onSubmit={formik.handleSubmit}>
                  <div className="input-select-wrap form-field">
                    <Input
                      ref={inputRef}
                      type="text"
                      className="form-control"
                      placeholder="00"
                      name="amount"
                      autoFocus={true}
                      autoComplete="off"
                      onChange={(e) =>
                        handleWholeNumberInputChange(
                          e,
                          formik.setFieldValue,
                          "amount"
                        )
                      }
                      value={formik.values.amount}
                      error={formik.touched.amount && formik.errors.amount}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <p className="ip_currancy">{CURRENCY_SYMBOL}</p>
                  </div>
                  <div className="common-dr-picker">
                    <InputDatePicker
                      className="d-flex flex-column form-field kyc-date-filter modal-add-amount-date"
                      date={formik.values.recurring_date}
                      onClick={() => setDatePicker(true)}
                      placeholder="Recurring Date"
                    />
                    {formik.touched.recurring_date &&
                    formik.errors.recurring_date ? (
                      <p
                        style={{ marginLeft: "10px" }}
                        className="kyc-text-danger"
                      >
                        {formik.errors.recurring_date}
                      </p>
                    ) : null}
                  </div>
                  {error ? (
                    <p className="text-danger text-center">{error}</p>
                  ) : null}
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
                          formik.values.amount?.length === 0
                            ? "disabled-font-color"
                            : ""
                        }`}
                        style={{ minWidth: "initial" }}
                        // onClick={handleCallback}
                        disabled={formik.values.amount?.length === 0}
                        autoFocus={true}
                      >
                        OK
                      </button>
                    </div>
                    {/* ) : null} */}
                  </div>
                </form>
              </div>
              <ModalDatePickerKyc
                minDate={
                  minDate ? new Date(minDate) : datePicker ? new Date() : ""
                }
                maxDate={maxDate ? new Date(maxDate) : ""}
                show={datePicker}
                setShow={() => setDatePicker(false)}
                classNameChild={"schedule-time-modal"}
                heading="Recurring Date"
                handleChangeDate={handleChangeDateFilter}
                currentDate={formik.values.recurring_date}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAddAmount;
