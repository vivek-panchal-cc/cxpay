import React, { useRef, useEffect } from "react";
import styles from "./modal.module.scss";

function ModalAlert(props) {
  const {
    className,
    classNameChild,
    id,
    show,
    setShow,
    heading,
    headingImg,
    subHeading,
    btnText,
    handleBtnClick,
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
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content money-sent-modal-content">
            <div className="modal-header">
              <div className="code-lock-icon">
                <img src={headingImg} alt="otp img" />
              </div>
            </div>
            <div className="modal-body">
              <h3>{heading}</h3>
              <p>{subHeading}</p>
              <div className="verify-code-btn-wrap">
                <button
                  type="button"
                  onClick={handleBtnClick}
                  className="btn money-sent-pop-close"
                  replace={true}
                >
                  {btnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAlert;
