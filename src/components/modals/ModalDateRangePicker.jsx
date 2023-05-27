import React, { useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import ReactDatePicker from "react-datepicker";

function ModalDateRangePicker(props) {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    heading,
    startDate,
    endDate,
    handleChangeDateRange,
  } = props;

  const modalRef = useRef(null);
  const [selectRange, setSelectedRange] = useState({ startDate, endDate });
  const [disableConfirm, setDisableConfirm] = useState(true);

  const handleRangeChange = async (dates) => {
    const [start, end] = dates;
    setSelectedRange({ startDate: start, endDate: end });
  };

  const handleSubmit = () => {
    const { startDate, endDate } = selectRange;
    if (!startDate) return;
    if (!endDate) setSelectedRange({ startDate, endDate: startDate });
    handleChangeDateRange({ startDate, endDate: endDate || startDate });
  };

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

  useEffect(() => {
    const { startDate } = selectRange;
    if (startDate) setDisableConfirm(false);
    else setDisableConfirm(true);
  }, [selectRange]);

  useEffect(() => {
    if (startDate === "" && endDate === "")
      setSelectedRange({ startDate: "", endDate: "" });
  }, [startDate, endDate]);

  if (!show) return;
  return (
    <div
      className={`test modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4">
            <div className="modal-header flex-column pb-3">
              <h3 className="text-center">{heading}</h3>
            </div>
            <ReactDatePicker
              selected={selectRange.startDate}
              startDate={selectRange.startDate}
              endDate={selectRange.endDate}
              onChange={handleRangeChange}
              selectsRange
              inline
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
                onClick={handleSubmit}
                disabled={disableConfirm}
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

export default ModalDateRangePicker;
