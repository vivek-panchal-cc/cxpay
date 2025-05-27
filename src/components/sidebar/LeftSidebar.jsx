import { CXPAY_SHADOW_LOGO } from "constants/all";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import { toast } from "react-toastify";
import {
  IconActivity,
  IconContact,
  IconHome,
  IconJar,
  IconLogout,
  IconMerchant,
  IconMore,
  IconProfileVerified,
  IconRequest,
  IconSend,
  IconSetting,
  IconWallet,
} from "styles/svgs";
import { useCms } from "context/cmsContext";
import { apiRequest } from "helpers/apiRequests";
import LoaderLogo from "loaders/loader-sidear/LoaderLogo";
import LoaderMainLink from "loaders/loader-sidear/LoaderMainLink";
import LoaderBottomLink from "loaders/loader-sidear/LoaderBottomLink";
import LoaderLeftWrap from "loaders/loader-sidear/LoaderLeftWrap";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";
import { LoaderContext } from "context/loaderContext";
import { usePinContext } from "context/pinContext";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import InputSwitch from "components/ui/InputSwitch";
import { useOrganizationSwitch } from "context/organizationSwitchContext";

function LeftSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  setShowPinPopup,
  setError,
}) {
  const { cmsPages } = useCms();
  const location = useLocation();
  const navigate = useNavigate();
  // const [error, setError] = useState("");
  const { setIsLoading } = useContext(LoaderContext);
  const { setIsPinValidated } = usePinContext();
  const { profile, isLoading } = useSelector((state) => state.userProfile);
  const { user_type, kyc_approved_status = "" } = profile || "";
  // const [showPinPopup, setShowPinPopup] = useState(false);
  const thisRoute = useMemo(() => location.pathname.split("/")[1], [location]);
  // const { handleForgotPin, OtpModal, PinModal } =
  //   useForgotPinHandler(setShowPinPopup);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const { isToggled, toggle } = useOrganizationSwitch();

  const updateSubMenuPosition = () => {
    const submenu = document.querySelector(
      ".dashboard-main-links .more-sub-menu"
    );
    const moreMenu = document.querySelector(".dashboard-main-links .more-menu");

    if (submenu && moreMenu) {
      const rect = moreMenu.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      setSubmenuPosition({
        top: rect.top,
        left: screenWidth > 991 ? rect.right : 0,
      });
    }
  };

  const updateBottomSubMenuPosition = () => {
    const submenu = document.querySelector(
      ".dashboard-bottom-links .more-sub-menu"
    );
    const moreMenu = document.querySelector(
      ".dashboard-bottom-links .more-menu"
    );

    if (submenu && moreMenu) {
      const rect = moreMenu.getBoundingClientRect();
      const submenuHeight = submenu.offsetHeight;
      const screenHeight = window.innerHeight;
      const wouldOverflow = rect.bottom + submenuHeight > screenHeight;

      setSubmenuPosition({
        top: rect.bottom - submenuHeight,
        left: window.innerWidth > 991 ? rect.right : 0,
      });
    }
  };

  useEffect(() => {
    function handleResize() {
      updateSubMenuPosition();
    }

    function handleScroll() {
      updateSubMenuPosition();
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      updateBottomSubMenuPosition();
    }

    function handleScroll() {
      updateBottomSubMenuPosition();
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const container = document.querySelector(
      ".dashboard-page > .container-fluid > .row"
    );

    if (container) {
      if (isSidebarOpen) {
        container.classList.add("sidebar-open");
      } else {
        container.classList.remove("sidebar-open");
      }
    }
  }, [isSidebarOpen]);

  if (isLoading) {
    return (
      <div className="dashboard-left-wrap">
        {/* <span className="toggle-admin-btn">
          <LoaderLeftWrap />
        </span> */}
        <div className="dashboard-logo-wrap">
          <LoaderLogo />
        </div>
        <div className="dashboard-link-wrap">
          <ul className="dashboard-main-links">
            <li>
              <LoaderMainLink />
            </li>
          </ul>
          <ul className="dashboard-bottom-links">
            <li>
              <LoaderBottomLink />
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Function to handle PIN validation
  // const handleSubmitPin = async (pin) => {
  //   if (!pin) return;
  //   setIsLoading(true);
  //   try {
  //     const { data } = await apiRequest.pinValidate({ user_pin: pin });
  //     if (!data.success) throw data;
  //     toast.success(data.message);
  //     setShowPinPopup(false);
  //     setIsPinValidated(true);
  //     navigate("/setting");
  //   } catch (error) {
  //     setError(error.message);
  //     if(error.data.is_suspended){
  //       navigate("/logout", { replace: true });
  //       toast.error(error.message);
  //     }
  //     // toast.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setError("");
    if (user_type === "agent") {
      navigate("/setting");
    } else {
      setShowPinPopup(true);
    }
  };

  const openCMSPages = (slug) => {
    navigate(`/more/${slug}`);
  };

  return (
    <div className="dashboard-left-wrap">
      <span className="toggle-admin-btn" onClick={handleToggleClick}>
        <img
          src="/assets/images/dashaboard-button-toggle.png"
          alt="button dashboard icon"
        />
      </span>
      <div className="dashboard-logo-wrap">
        <Link to="/" replace>
          <img src={CXPAY_SHADOW_LOGO} alt="dashboard logo" />
        </Link>
        {/* <div className="organization-toggle">
          <ul>
            <li>
              <label className="form-switch labelToggleOff">OFF</label>
              <InputSwitch
                name="switch_organization"
                className="form-check-input"
                labelOffText=""
                labelOnText=""
                onChange={toggle}
                checked={isToggled}
              />
              <label className="form-switch labelToggleOn">ON</label>
            </li>
          </ul>
        </div> */}
        <Link to="/" className="dashaboard-btn text-capitalize" replace>
          {user_type}
        </Link>
      </div>
      <div className="dashboard-link-wrap">
        <ul className="dashboard-main-links">
          <li className={`${thisRoute === "" ? "active" : ""}`}>
            <Link to="/" replace>
              <IconHome />
              <span>Dashboard</span>
            </Link>
          </li>
          {user_type !== "agent" && (
            <>
              {kyc_approved_status === "approved" && (
                <li className={`${thisRoute === "send" ? "active" : ""}`}>
                  <Link to="/send" replace>
                    <IconSend style={{ stroke: "#F3F3F3" }} />
                    <span>Send</span>
                  </Link>
                </li>
              )}
              {kyc_approved_status === "approved" && (
                <li className={`${thisRoute === "request" ? "active" : ""}`}>
                  <Link to="/request" replace>
                    <IconRequest />
                    <span>Request</span>
                  </Link>
                </li>
              )}
              <li className={`${thisRoute === "activities" ? "active" : ""}`}>
                <Link to="/activities" replace>
                  <IconActivity />
                  <span>Activities</span>
                </Link>
              </li>
              {kyc_approved_status === "approved" && (
                <li className={`${thisRoute === "wallet" ? "active" : ""}`}>
                  <Link to="/wallet" replace>
                    <IconWallet />
                    <span>Wallet</span>
                  </Link>
                </li>
              )}
              <li
                className={`${
                  thisRoute === "contacts" || thisRoute === "contacts-invited"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/contacts" replace>
                  <IconContact style={{ stroke: "#F3F3F3" }} />
                  <span>Contacts</span>
                </Link>
              </li>
              <li className={`${thisRoute === "jars" ? "active" : ""}`}>
                <Link to="/jars/own" replace>
                  <IconJar />
                  <span>Sub-accounts</span>
                </Link>
              </li>
              <li className={`${thisRoute === "merchants" ? "active" : ""}`}>
                <Link to="/merchants" replace>
                  <IconMerchant style={{ stroke: "#F3F3F3" }} />
                  <span>Merchants</span>
                </Link>
              </li>
            </>
          )}
          {user_type === "agent" && (
            <>
              <li className={`${thisRoute === "top-up" ? "active" : ""}`}>
                <Link to="/top-up" replace>
                  <IconSend style={{ stroke: "#F3F3F3" }} />
                  <span>Top Up</span>
                </Link>
              </li>
              <li
                className={`${
                  thisRoute === "top-up-activities" ? "active" : ""
                }`}
              >
                <Link to="/top-up-activities" replace>
                  <IconActivity />
                  <span>Activities</span>
                </Link>
              </li>
            </>
          )}
          {/* {cmsPages?.length ? ( */}
          {/* <li
            className={`more-menu ${
              thisRoute.startsWith("more") ? "active" : ""
            }`}
            onMouseEnter={updateSubMenuPosition}
          >
            <a>
              <IconMore style={{ stroke: "#F3F3F3" }} />
              <span>More</span>
            </a>
            <ul
              className="more-sub-menu"
              style={{
                top: `${submenuPosition.top}px`,
                left: `${submenuPosition.left}px`,
              }}
            >
              <div className="more-sub-menu-scroll">
                {cmsPages?.map((page) => (
                  <li
                    key={page.id}
                    className={`${
                      location.pathname === `/more/${page.slug}` ? "active" : ""
                    }`}
                  >
                    <Link
                      to={`/more/${page.slug}`}
                      // onClick={() => openCMSPages(page.slug)}
                      replace
                    >
                      <span>{page.title}</span>
                    </Link>
                  </li>
                ))}
                <li
                  className={`${
                    location.pathname === `/more/faq` ? "active" : ""
                  }`}
                >
                  <Link to="/more/faq" replace>
                    <span>FAQs</span>
                  </Link>
                </li>
              </div>
            </ul>
          </li> */}
          {/* ) : null} */}
        </ul>
        <ul className="dashboard-bottom-links">
          <li className={`${thisRoute === "profile" ? "active" : ""}`}>
            <Link to="/profile" replace>
              <IconProfileVerified />
              <span>Profile</span>
            </Link>
          </li>
          <li className={`${thisRoute === "setting" ? "active" : ""}`}>
            {/* <a href="#" onClick={handleSettingsClick}> */}
            <Link to="/setting" replace>
              <IconSetting style={{ fill: "#fff100" }} />
              <span>Settings</span>
            </Link>
            {/* </a> */}
          </li>
          <li
            className={`more-menu ${
              thisRoute.startsWith("more") ? "active" : ""
            }`}
            onMouseEnter={updateBottomSubMenuPosition}
          >
            <a>
              <IconMore style={{ stroke: "#FFF100" }} />
              <span>More</span>
            </a>
            <ul
              className="more-sub-menu"
              style={{
                top: `${submenuPosition.top}px`,
                left: `${submenuPosition.left}px`,
              }}
            >
              <div className="more-sub-menu-scroll">
                {cmsPages?.map((page) => (
                  <li
                    key={page.id}
                    className={`${
                      location.pathname === `/more/${page.slug}` ? "active" : ""
                    }`}
                  >
                    <Link
                      to={`/more/${page.slug}`}
                      // onClick={() => openCMSPages(page.slug)}
                      replace
                    >
                      <span>{page.title}</span>
                    </Link>
                  </li>
                ))}
                <li
                  className={`${
                    location.pathname === `/more/faq` ? "active" : ""
                  }`}
                >
                  <Link to="/more/faq" replace>
                    <span>FAQs</span>
                  </Link>
                </li>
              </div>
            </ul>
          </li>
          <li>
            <Link to="/logout" replace>
              <IconLogout style={{ stroke: "#FFF100" }} />
              <span>Log out</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* {showPinPopup && (
        <ModalPaymentPin
          id="group_pay_otp_modal"
          className="otp-verification-modal group_pay_otp_modal"
          show={showPinPopup}
          allowClickOutSide={true}
          setShow={setShowPinPopup}
          heading="5 - Digit PIN Access"
          headingImg="/assets/images/setupPin.svg"
          subHeading="Secure your account with 5 - Digit PIN Access"
          validationSchema={sendPaymentPinSchema}
          error={error}
          handleSubmitPin={handleSubmitPin}
          handleForgotPin={handleForgotPin}
        />
      )}
      {OtpModal()}
      {PinModal()} */}
    </div>
  );
}

export default LeftSidebar;
