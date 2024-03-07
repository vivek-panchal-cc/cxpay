import React, { useContext } from "react";
import { SignupContext } from "context/signupContext";
import { LoaderContext } from "context/loaderContext";
import { Link, useNavigate } from "react-router-dom";
import { CXPAY_LOGO } from "constants/all";
import { storageRequest } from "helpers/storageRequests";

function KycManualSecondStep(_props) {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds } = useContext(SignupContext);

  const logout = () => {
    (() => {
      storageRequest.removeAuth();
      navigate("/login", { replace: true });
    })();
  };

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="login-logo-image text-center">
                <img src={CXPAY_LOGO} alt="kyc logo img" />
              </div>
              <h5 className="blue-text text-center">
                Your KYC details has not been approved please try again.
              </h5>
              <div className="login-other-option">
                <div className="pt-4 login-with-opt-wrap">
                  <Link className="btn btn-primary blue-bg" to="/kyc-manual">
                    Complete KYC
                  </Link>
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
