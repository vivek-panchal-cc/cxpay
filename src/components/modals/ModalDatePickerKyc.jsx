import React, { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./modal.module.scss";

function ModalDatePickerKyc(props) {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    heading,
    handleChangeDate,
  } = props;

  const modalRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target)) {
        if (setShow) setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setShow]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleChangeDate(date);
    setShow(false); // Close modal after selecting a date
  };

  if (!show) return null;

  return (
    <div
      className={`test modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 common-dr-picker">
            <div className="modal-header flex-column pb-3">
              <h3 className="text-center">{heading}</h3>
            </div>
            <ReactDatePicker
              minDate={props.minDate || new Date()}
              value={selectedDate || new Date()}
              onChange={handleDateChange}
              className="kyc-expiry-date"
              // inline
            />
            <div className="popup-btn-wrap d-flex align-items-center justify-content-center gap-4">
              <button
                type="button"
                className="outline-btn px-4"
                style={{ minWidth: "initial" }}
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary px-4 py-3"
                style={{ minWidth: "initial" }}
                onClick={() => {
                  setShow(false);
                }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDatePickerKyc;
