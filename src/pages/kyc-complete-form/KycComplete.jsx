import React, { useEffect, useMemo } from "react";
import { CXPAY_LOGO } from "constants/all";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { storageRequest } from "helpers/storageRequests";
import { fetchUserProfile } from "features/user/userProfileSlice";

const KycComplete = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type, kyc_approved_status = "" } = profile || {};

  useEffect(() => {
    const fetchAndCheckKyc = async () => {
      // Fetch user profile when the component mounts
      await dispatch(fetchUserProfile());
    };

    fetchAndCheckKyc();
  }, [dispatch]);

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap">
              <div className="login-signup-inner">
                <div className="login-logo-image text-center">
                  <a href="/">
                    <img src={CXPAY_LOGO} alt="login logo img" />
                  </a>
                </div>
                <h5 className="text-center">
                  Please update your KYC from Cx PayMe mobile App
                </h5>
                <div className="login-other-option">
                  <div className="pt-4 login-with-opt-wrap">
                    <button
                      type="button"
                      className="btn btn-primary blue-bg"
                      onClick={() => navigate(-1)}
                    >
                      Back
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

export default KycComplete;
