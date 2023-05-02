import React from "react";
import styles from "./loaders.module.scss";
import { CXPAY_LOGO } from "constants/all";

function Default() {
  return (
    <div
      className={`position-fixed h-100 w-100 top-0 bottom-0 start-0 end-0 ${styles.default}`}
    >
      <div className="d-flex flex-column align-items-center">
        <img src={CXPAY_LOGO} alt="" width={100} />
        {/* <p className="text-white mt-4">Innovation Through EPayments</p> */}
        <p className="text-white mt-2 mb-1">Loading...</p>
        <div className="dotcontainer">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}

export default Default;
