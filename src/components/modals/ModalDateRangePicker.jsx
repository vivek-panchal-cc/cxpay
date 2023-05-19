import React, { useEffect, useRef } from "react";
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
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              onChange={handleChangeDateRange}
              selectsRange
              inline
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDateRangePicker;
