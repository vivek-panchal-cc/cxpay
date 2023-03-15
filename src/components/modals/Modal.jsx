import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";

function Modal(props) {
  const { children, className, id, show, setShow } = props;
  const modalRef = useRef(null);

  useEffect(() => {
    function handleclickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShow && setShow(false);
      }
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
      <div ref={modalRef}>{children}</div>
    </div>
  );
}

export default Modal;
