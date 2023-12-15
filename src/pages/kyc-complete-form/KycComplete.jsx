import React, { useEffect, useMemo } from "react";
import { CXPAY_LOGO } from "constants/all";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { storageRequest } from "helpers/storageRequests";
import { fetchUserProfile } from "features/user/userProfileSlice";

const KycComplete = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type, is_kyc } = profile || {};

  useEffect(() => {
    const fetchAndCheckKyc = async () => {
      // Fetch user profile when the component mounts
      await dispatch(fetchUserProfile());
    };

    fetchAndCheckKyc();
  }, [dispatch]);

  // Use the latest is_kyc value from the updated profile
  const { is_kyc: updatedIsKyc } = profile || {};

  useEffect(() => {
    if (updatedIsKyc) {
      console.warn("User has completed KYC, navigating dashboard");
      window.location.href = "/";
    } else {
      // storageRequest.removeAuth();
    }
  }, [updatedIsKyc]);

  const loginBack = () => {
    storageRequest.removeAuth();
    window.location.href = "/login"
  }

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
                {is_kyc ? (
                  <h5 className="text-center">
                    Your KYC is already done click below to redirect dashboard
                  </h5>
                ) : (
                  <h5 className="text-center">Complete your KYC first</h5>
                )}
                {is_kyc ? (
                  <div className="login-other-option">
                    <div className="login-signup-inner login-with-opt-wrap">
                      <Link className="btn btn-primary blue-bg" to="/">
                        Dashboard
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="login-other-option">
                    <div className="login-signup-inner login-with-opt-wrap">
                      <button className="btn btn-primary blue-bg" onClick={loginBack}>
                        Login
                      </button>
                    </div>
                  </div>
                )}
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

export default KycComplete;
