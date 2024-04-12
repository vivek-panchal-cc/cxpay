import { LoaderContext } from "context/loaderContext";
import { LoginContext } from "context/loginContext";
import { SystemOptionsContext } from "context/systemOptionsContext";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IconAlert, IconArrowRight } from "styles/svgs";
import KycChecked from "./kyc-checked/KycChecked";
import { toast } from "react-toastify";
import NotificationDropdown from "./notification-dropdown/NotificationDropdown";
import ProfileDropdown from "./profile-dropdown/ProfileDropdown";

const NotificationBar = (props) => {
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "" } = profile || {};
  const { MANUAL_KYC } = useContext(SystemOptionsContext);
  const { loginCreds, setLoginCreds } = useContext(LoginContext);
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
      )}&is_cancel=${encodeURIComponent(true)}&is_renew=${encodeURIComponent(
        true
      )}`;
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    }
  };

  const sendMail = async () => {
    setIsLoading(true);
    try {
      const reqParams = {
        is_apply_for_renew: "true",
        kyc_type: kycType,
        device_type: "web",
        send_email: true,
        kyc_status: "false",
      };
      const { data } = await apiRequest.updateCustomerKyc(reqParams);
      if (!data.success) throw data.message;
      toast.success(`${data.message}`);
      setLoginCreds((ls) => ({
        ...ls,
        renew_kyc_approved_status:
          data.data.kyc_renew_data?.renew_kyc_approved_status || "",
        renew_kyc_attempt_count:
          data.data.kyc_renew_data?.renew_kyc_attempt_count || "",
        show_renew_section: data.data.kyc_renew_data?.show_renew_section || "",
        show_renew_button: Boolean(data.data.kyc_renew_data?.show_renew_button),
        kyc_message: data.data.kyc_renew_data?.kyc_message || "",
      }));      
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    } finally {
      setIsLoading(false);
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
                <span>Renew your KYC now</span>
              </a>
            ) : (
              (show_renew_section === "renew_limit_exceed" ||
                show_renew_section === "renew_limit_exceed_and_disable") && (
                <a className="kyc-expire-link" onClick={sendMail}>
                  <span>Send Mail</span>
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
