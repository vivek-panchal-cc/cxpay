import React from "react";
import styles from "./loaders.module.scss";

const LoaderPaymentProcess = (props) => {
  return (
    <div
      className={`${styles.default}`}
      style={{
        height: "400px",
        background: "#00000000",
        ...(props?.style || {}),
      }}
    >
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div className="dotcontainer">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <p className="mt-5 pb-0 text-secondary badge">
          Please wait, we are processing your payment.
        </p>
        {props?.message ? (
          <p className="text-secondary" style={{ fontSize: "11px" }}>
            {props.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LoaderPaymentProcess;
