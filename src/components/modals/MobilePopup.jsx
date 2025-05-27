import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "./modal.module.scss";
import { getMobilePlatform } from "utils/platformUtils";
import { CXPAY_LOGO } from "constants/all";
import { useLocation } from "react-router-dom";
import { SystemOptionsContext } from "context/systemOptionsContext";

function MobilePopup(props) {
  const {
    className,
    classNameChild,
    id,
    setShow,
    heading = "Download Our App!",
    allowClickOutSide,
  } = props;

  const modalRef = useRef(null);
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const { APP_INSTALL_LINK_IOS, APP_INSTALL_LINK_ANDROID } =
    useContext(SystemOptionsContext);
  const [isChecking, setIsChecking] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // For closing the modal on click of outside the modal area
  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        !allowClickOutSide && setShow && setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow, allowClickOutSide]);

  useEffect(() => {
    const platform = getMobilePlatform();
    if (APP_INSTALL_LINK_ANDROID && APP_INSTALL_LINK_IOS) {
      setIsChecking(false);
      if (platform) {
        setShowPopup(true);
        if (platform === "android") {
          setDownloadUrl(APP_INSTALL_LINK_ANDROID);
        } else if (platform === "ios") {
          setDownloadUrl(APP_INSTALL_LINK_IOS);
        }
      } else {
        setShowPopup(false);
      }
    }
  }, [location.pathname, APP_INSTALL_LINK_ANDROID, APP_INSTALL_LINK_IOS]);

  if (!showPopup) return null;

  return (
    <div
      className={`test modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="login-logo-image text-center">
                <img src={CXPAY_LOGO} alt="cxpayme img" />
              </div>
            </div>
            <h3 className="text-center">{heading}</h3>
            <div className="modal-body">
              <form className="login-otp-numbers">
                <label className="mb-3 w-100 text-center">
                  Get the best experience on mobile by downloading our app.
                </label>
                {!isChecking && (
                  <div className="popup-btn-wrap">
                    <button
                      type="button"
                      className={`btn btn-primary cursor-pointer`}
                      onClick={() => window.open(downloadUrl, "_blank")}
                    >
                      {" "}
                      Download{" "}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobilePopup;
