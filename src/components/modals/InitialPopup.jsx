import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import { IconCloseModal } from "styles/svgs";
import { CXPAY_LOGO } from "constants/all";
import { LoginContext } from "context/loginContext";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

function InitialPopup(props) {
  const {
    className,
    classNameChild,
    id,
    setShow,
    heading = "",
    allowClickOutSide,
  } = props;

  const modalRef = useRef(null);
  const { setIsLoading } = useContext(LoaderContext);
  const { loginCreds, setLoginCreds } = useContext(LoginContext);
  const { show_popup, popup_message = "" } = loginCreds;
  const [initialPopup, setInitialPopup] = useState(show_popup);

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

  // useEffect(() => {
  //   (() => {
  //     if (show_popup) setInitialPopup(true);
  //     else setInitialPopup(false);
  //   })();
  // }, [show_popup]);

  useEffect(() => {
    setInitialPopup(show_popup);
  }, [show_popup]);

  const handleBtnClick = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.acknowledgementPopup();
      if (!data.success) throw data.messsage;
      setLoginCreds((ls) => ({ ...ls, show_popup: false }));
      setInitialPopup(false);
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlagManage = () => {
    setInitialPopup(false);
    setLoginCreds((ls) => ({ ...ls, show_popup: false }));
  };

  if (!initialPopup || !popup_message.trim()) return null;

  return (
    <div
      className={`test modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ position: "relative" }}>
            <IconCloseModal
              style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                cursor: "pointer",
              }}
              onClick={handleFlagManage}
            />{" "}
            {/* <div className="modal-header">
              <div className="login-logo-image text-center mb-0">
                <img src={CXPAY_LOGO} alt="cxpayme img" />
              </div>
            </div> */}
            {/* <h3 className="text-center">{heading}</h3> */}
            <div className="modal-body">
              <form className="login-otp-numbers">
                <label className="mb-3 w-100 text-center dark_blue">
                  {popup_message}
                </label>
                <div className="popup-btn-wrap">
                  <button
                    type="button"
                    className={`btn btn-primary cursor-pointer`}
                    onClick={handleBtnClick}
                  >
                    {" "}
                    Got it{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitialPopup;
