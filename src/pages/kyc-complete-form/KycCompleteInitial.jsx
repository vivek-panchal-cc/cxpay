import React, { useContext, useEffect, useMemo } from "react";
import { CXPAY_LOGO } from "constants/all";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { storageRequest } from "helpers/storageRequests";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { SystemOptionsContext } from "context/systemOptionsContext";

const KycCompleteInitial = () => {
  const { SUPPORT_EMAIL } = useContext(SystemOptionsContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      (() => {
        removeAuthentication();
      })();
    };
  }, []);

  useEffect(() => {
    (() => {
      removeAuthentication();
    })();
  }, []);

  const removeAuthentication = () => {
    storageRequest.removeAuth();
  };

  const logout = () => {
    (() => {
      removeAuthentication();
    })();
    window.location.href = "/";
  };

  const handleBeforeUnload = (event) => {
    // Cancel the event to prevent the browser from navigating away
    // event.preventDefault();
    // Remove the authentication
    (() => {
      removeAuthentication();
    })();
  };

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap">
              <div className="login-signup-inner">
                {/* <h4 className="text-center">Welcome to</h4> */}
                <div style={{ marginBottom: "20px" }}></div>
                <div className="login-logo-image text-center">
                  <img src={CXPAY_LOGO} alt="login logo img" />
                </div>

                {message ? (
                  <h5 className="text-center mb-0">
                    {decodeURIComponent(message)}
                  </h5>
                ) : (
                  <h5 className="text-center mb-0">
                    Please update your KYC from CX PayMe mobile App.
                  </h5>
                )}
                <div className="login-other-option">
                  <div className="login-signup-inner login-with-opt-wrap">
                    <button
                      className="btn btn-primary blue-bg"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script src="js/bootstrap.bundle.min.js"></script>
      <script src="js/bootstrap.esm.min.js"></script>
    </div>
  );
};

export default KycCompleteInitial;
