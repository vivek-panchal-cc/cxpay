import React from "react";
import { CXPAY_LOGO } from "constants/all";

const KycComplete = () => {
 
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
