import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";

function Modal(props) {
  const { children, className, classNameChild, id, show, setShow } = props;
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

  if (!show) return null;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
