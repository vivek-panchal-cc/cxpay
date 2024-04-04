import { LoginContext } from "context/loginContext";
import { SystemOptionsContext } from "context/systemOptionsContext";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IconAlert, IconArrowRight } from "styles/svgs";
import KycChecked from "./kyc-checked/KycChecked";
import NotificationDropdown from "./notification-dropdown/NotificationDropdown";
import ProfileDropdown from "./profile-dropdown/ProfileDropdown";

const NotificationBar = (props) => {
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "" } = profile || {};
  const { MANUAL_KYC } = useContext(SystemOptionsContext);
  const { loginCreds } = useContext(LoginContext);
  const { kyc_message, show_renew_button, show_renew_section } = loginCreds;
  const kycType = MANUAL_KYC?.toString() === "true" ? "MANUAL" : "SYSTEM";

  const redirectKyc = () => {
    try {
      if (MANUAL_KYC?.toString() === "true") {
        navigate("/kyc-manual", {
          state: { kycStatus: true, kycUpdate: "renew" },
        });
      } else if (MANUAL_KYC?.toString() === "false") {
        navigate("/complete-kyc-valid", { state: { kycValid: true } });
      }
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    }
  };

  const redirectMail = () => {
    try {
      window.location.href = `/send-mail?message=${encodeURIComponent(
        kyc_message
      )}&system_option_manual_kyc_status=${encodeURIComponent(
        kycType
      )}&is_cancel=${encodeURIComponent(true)}`;
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    }
  };

  useEffect(() => {
    if (!navbarRef.current) return;
    const handleScroll = (event) => {
      const body = event.target;
      const bar = navbarRef.current;
      const scrollTop = event.target.scrollTop;
      const elmBottom = bar.offsetTop + bar.clientHeight;
      if (scrollTop > 10) body.classList.add("sticky_appear");
      else body.classList.remove("sticky_appear");
    };
    document.querySelector("body").addEventListener("scroll", handleScroll);
    return () => {
      document
        .querySelector("body")
        .removeEventListener("scroll", handleScroll);
    };
  }, [navbarRef]);

  return (
    <div className={`dashboard-top-sec no-search-ontop`} ref={navbarRef}>
      {show_renew_section && (
        <div className="dashboard-notification-kyc-expire">
          <label>
            <IconAlert /> {kyc_message}{" "}
            {show_renew_button ? (
              <a className="kyc-expire-link" onClick={redirectKyc}>
                <span>
                  Renew your KYC now
                  {/* <IconArrowRight fill="#0081c5" /> */}
                </span>
              </a>
            ) : (
              show_renew_section === "renew_limit_exceed" && (
                <a className="kyc-expire-link" onClick={redirectMail}>
                  <span>
                    Send Mail
                    {/* <IconArrowRight fill="#0081c5" /> */}
                  </span>
                </a>
              )
            )}
          </label>
        </div>
      )}
      <div className="dashboard-notification-sec gap-4">
        {/* {user_type !== "agent" && <KycChecked />} */}
        {user_type !== "agent" && <NotificationDropdown />}
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default NotificationBar;
