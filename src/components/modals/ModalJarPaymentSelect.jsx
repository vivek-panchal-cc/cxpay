import React, { useState, useRef, useEffect } from "react";
import styles from "./modal.module.scss";
import { IconClock, IconInstantPay, IconSyncAlt } from "styles/svgs";

function ModalJarPaymentSelect({
  id,
  className,
  classNameChild,
  show,
  setShow,
  handleCallback,
  handleSchedulePayment,
  handleInstantPayment,
  handleRecurringPayment,
}) {
  const modalRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(1);

  const paymentOptions = [
    {
      id: 1,
      icon: <IconInstantPay />,
      title: "Instant Pay",
      color: "#93E06F", // Green
    },
    {
      id: 2,
      icon: <IconClock stroke="#ffffff" />,
      title: "Schedule Payment",
      color: "#936EE3", // Purple
    },
    {
      id: 3,
      icon: <IconSyncAlt />,
      title: "Recurring Payment",
      color: "#0081C5", // Blue
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current.children[0];
      if (childDialog && !childDialog.contains(event.target)) {
        if (setShow) setShow(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setShow]);

  const handlePayement = () => {
    switch (selectedOption) {
      case 1:
        handleInstantPayment();
        setSelectedOption(1);
        break;
      case 2:
        handleSchedulePayment();
        setSelectedOption(1);
        break;
      case 3:
        handleRecurringPayment();
        setSelectedOption(1);
        break;
      default:
        break;
    }
  };

  if (!show) return null;

  return (
    <div
      className={`modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className={styles.paymentOptions}>
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.option} ${
                      selectedOption === option.id ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div
                      className={styles.iconWrap}
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <span className={styles.title}>{option.title}</span>
                    <div className="form-field jar-payment-selection">
                      <input
                        type="checkbox"
                        id={`select_payment_${option.id}`} // Unique ID for each checkbox
                        name="select_payment"
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                      />
                      <label htmlFor={`select_payment_${option.id}`}></label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row mt-4">
                <div className="col-12 p-0 btns-inline">
                  <div className="setting-btn-link btn-wrap w-100">
                    <button
                      type="button"
                      onClick={handleCallback}
                      className="outline-btn w-100 text-center d-block"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="btn-wrap">
                    <button
                      type="button"
                      autoFocus={true}
                      onClick={handlePayement}
                      className="btn btn-primary w-100"
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalJarPaymentSelect;
