import React, { useContext } from "react";
import { SignupContext } from "context/signupContext";
import { LoaderContext } from "context/loaderContext";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CXPAY_LOGO } from "constants/all";
import { storageRequest } from "helpers/storageRequests";
import { useDispatch } from "react-redux";
import { fetchLogout } from "features/user/userProfileSlice";

function KycManualSecondStep(_props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds } = useContext(SignupContext);
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");

  const redirectManualKyc = (e) => {
    try {
      navigate("/kyc-manual", {
        state: { kycStatus: true },
      });
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    } finally {
    }
  };

  const logout = () => {
    (async () => {
      try {
        const { error, payload } = await dispatch(fetchLogout());
        if (error) throw payload;
        navigate("/login", { replace: true });
      } catch (error) {
        navigate("/login", { replace: true });
      }
    })();
  };

  if (!message) return <Navigate to="/" replace />;

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="login-logo-image text-center">
                <img src={CXPAY_LOGO} alt="kyc logo img" />
              </div>
              {message ? (
                <h5
                  style={{ marginRight: "20px", marginLeft: "20px" }}
                  className="blue-text text-center"
                >
                  {message}
                </h5>
              ) : (
                <h5 className="blue-text text-center">
                  Your Kyc details has not been approved. Please try again.
                </h5>
              )}
              <div className="login-other-option">
                <div className="pt-4 login-with-opt-wrap">
                  <button
                    type="button"
                    className="btn btn-primary blue-bg"
                    onClick={redirectManualKyc}
                  >
                    Process KYC
                  </button>
                </div>
              </div>
              <div className="pop-cancel-btn text-center">
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KycManualSecondStep;
