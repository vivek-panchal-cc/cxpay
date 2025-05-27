import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import styles from "./modal.module.scss";
import { setOccurrenceDate } from "schemas/jarSchema";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalDatePickerKyc from "./ModalDatePickerKyc";

function ModalAddDate(props) {
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
    date,
    btnName = "Ok",
    calendarHeader = "Date",
  } = props;
  const [datePicker, setDatePicker] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: date || "",
    },
    validationSchema: setOccurrenceDate,
    onSubmit: (values) => {
      handleCallback({
        date: values.date,
      });
    },
  });

  const handleChangeDateFilter = (date) => {
    if (datePicker && date instanceof Date && !isNaN(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`; // yyyy-mm-dd in local time
      formik.setFieldValue("date", formattedDate);
    }
    setDatePicker("");
  };

  useEffect(() => {
    if (date) {
      const today = new Date();
      const inputDate = new Date(date);

      // Set time to 0 to compare only date parts
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        // Format today as yyyy-mm-dd
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedToday = `${year}-${month}-${day}`;
        formik.setFieldValue("date", formattedToday);
      }
    }
  }, [date, show]);

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
            <div>{children}</div>
            <div className="">
              <form onSubmit={formik.handleSubmit}>
                <div className="common-dr-picker">
                  <InputDatePicker
                    className="d-flex flex-column form-field kyc-date-filter modal-add-amount-date"
                    date={formik.values.date}
                    onClick={() => setDatePicker(true)}
                    placeholder={calendarHeader}
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <p
                      style={{ marginLeft: "10px" }}
                      className="kyc-text-danger"
                    >
                      {formik.errors.date}
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
                    <button
                      type="submit"
                      className={`outline-btn px-4 py-3`}
                      style={{ minWidth: "initial" }}
                      autoFocus={true}
                    >
                      {btnName}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <ModalDatePickerKyc
              minDate={datePicker ? new Date() : ""}
              show={datePicker}
              setShow={() => setDatePicker(false)}
              classNameChild={"schedule-time-modal"}
              heading={calendarHeader}
              handleChangeDate={handleChangeDateFilter}
              currentDate={formik.values.date}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAddDate;
