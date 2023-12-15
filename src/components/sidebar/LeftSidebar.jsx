import { CXPAY_SHADOW_LOGO } from "constants/all";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import { toast } from "react-toastify";
import {
  IconActivity,
  IconContact,
  IconHome,
  IconLogout,
  IconMore,
  IconProfileVerified,
  IconRequest,
  IconSend,
  IconSetting,
  IconWallet,
} from "styles/svgs";
import { useCms } from "context/cmsContext";
import { apiRequest } from "helpers/apiRequests";

function LeftSidebar() {
  const { cmsPages } = useCms();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isLoading } = useSelector((state) => state.userProfile);
  const { user_type, is_kyc } = profile || "";

  const thisRoute = useMemo(() => location.pathname.split("/")[1], [location]);

  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  const updateSubMenuPosition = () => {
    const submenu = document.querySelector(".dashboard-main-links .more-sub-menu");
    const moreMenu = document.querySelector(".dashboard-main-links .more-menu");

    if (submenu && moreMenu) {
      const rect = moreMenu.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      setSubmenuPosition({
        top: rect.top,
        left: screenWidth > 768 ? rect.right : 0,
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

  if (isLoading) {
    return null;
  }

  const handleToggleClick = () => {
    $(".dashboard-page > .container-fluid > .row").toggleClass("sidebar-open");
  };

  // List of restricted routes
  const restrictedRoutes = [
    "send",
    "request",
    "wallet",
    "view-recurring-payment",
    "view-schedule-payment",
  ];

  // Redirect logic for restricted routes
  const shouldRedirectToRestrictedRoute =
    !is_kyc && restrictedRoutes.includes(thisRoute);

  if (shouldRedirectToRestrictedRoute) {
    useEffect(() => {
      toast.warning("Complete your KYC first", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/", { replace: true });
    }, []); // Add an empty dependency array to ensure it runs only once

    return null; // Prevent further rendering
  }

  const openCMSPages = async (slug) => {
    try {
      const { request } = await apiRequest.getCMSPage(slug);
      window.open(request.responseURL, "_blank");
    } catch (error) {
      console.error("Error fetching cms page:", error);
    }
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
              {is_kyc && (
                <li className={`${thisRoute === "send" ? "active" : ""}`}>
                  <Link to="/send" replace>
                    <IconSend style={{ stroke: "#F3F3F3" }} />
                    <span>Send</span>
                  </Link>
                </li>
              )}
              {is_kyc && (
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
              {is_kyc && (
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
          <li
            className={`more-menu ${
              thisRoute.startsWith("more") ? "active" : ""
            }`}
            onMouseEnter={updateSubMenuPosition}
          >
            <a>
              <IconMore style={{ stroke: "#F3F3F3" }} />
              <span>More</span>
            </a>
            <ul className="more-sub-menu" style={{ top: `${submenuPosition.top}px`, left: `${submenuPosition.left}px` }}>
              {cmsPages?.map((page) => (
                <li
                  key={page.id}
                  className={`${
                    thisRoute === `more/${page.slug}` ? "active" : ""
                  }`}
                >
                  <Link
                    // to={`/more/${page.slug}`}
                    onClick={() => openCMSPages(page.slug)}
                    replace
                  >
                    <span>{page.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <ul className="dashboard-bottom-links">
          <li className={`${thisRoute === "profile" ? "active" : ""}`}>
            <Link to="/profile" replace>
              <IconProfileVerified />
              <span>Profile</span>
            </Link>
          </li>
          <li className={`${thisRoute === "setting" ? "active" : ""}`}>
            <Link to="/setting" replace>
              <IconSetting style={{ fill: "#fff100" }} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/logout" replace>
              <IconLogout style={{ stroke: "#FFF100" }} />
              <span>Log out</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSidebar;
