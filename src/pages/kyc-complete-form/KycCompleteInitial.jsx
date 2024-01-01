import React, { useEffect, useMemo } from "react";
import { CXPAY_LOGO } from "constants/all";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { storageRequest } from "helpers/storageRequests";
import { fetchUserProfile } from "features/user/userProfileSlice";

const KycCompleteInitial = () => {
  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      removeAuthentication();
    };
  }, []);

  useEffect(() => {
    removeAuthentication();
  }, []);

  const removeAuthentication = () => {
    storageRequest.removeAuth();
  };

  const logout = () => {
    storageRequest.removeAuth();
    window.location.href = "/";
  };

  const handleBeforeUnload = (event) => {
    // Cancel the event to prevent the browser from navigating away
    // event.preventDefault();
    // Remove the authentication
    removeAuthentication();
  };

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap">
              <div className="login-signup-inner">
                <h4 className="text-center">Welcome to</h4>
                <div className="login-logo-image text-center">
                  <a href="/">
                    <img src={CXPAY_LOGO} alt="login logo img" />
                  </a>
                </div>

                <h5 className="text-center">Complete your KYC first</h5>

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
