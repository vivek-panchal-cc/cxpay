import React from "react";
import styles from "./loaders.module.scss";

function Default() {
  return (
    <div
      className={`position-fixed h-100 w-100 top-0 bottom-0 start-0 end-0 ${styles.default}`}
    >
      <div className="d-flex flex-column align-items-center">
        <img src="/assets/images/dashaboard-logo.png" alt="" width={100} />
        {/* <p className="text-white mt-4">Innovation Through EPayments</p> */}
        <p className="text-white mt-3">Loading...</p>
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
