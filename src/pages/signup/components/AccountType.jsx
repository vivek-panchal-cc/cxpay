import React, { useContext, useState } from "react";
import { SignupContext } from "context/signupContext";

function SelectaccountType(props) {
  const { setSignUpCreds } = useContext(SignupContext);
  const [userType, setUserType] = useState("personal");

  const handleChangeAccountType = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSignUpCreds((cs) => ({ ...cs, user_type: userType, step: 2 }));
  };

  return (
    <div className="container login-account-type">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <div className="login-signup-inner">
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src="/assets/images/logo-1.png" alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Select Account Type
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="form-field acount-type-wrap">
                  <div className="cust-radio-wrap">
                    <input
                      type="radio"
                      id="personal"
                      name="user_type"
                      value={"personal"}
                      onChange={handleChangeAccountType}
                      checked={userType === "personal"}
                    />
                    <label htmlFor="personal">
                      <div className="account-type-content">
                        <img src="/assets/images/Personal.svg" alt="" />
                        <p>Personal</p>
                      </div>
                    </label>
                  </div>
                  <div className="cust-radio-wrap">
                    <input
                      type="radio"
                      id="business"
                      name="user_type"
                      value={"business"}
                      onChange={handleChangeAccountType}
                      checked={userType === "business"}
                    />
                    <label htmlFor="business">
                      <div className="account-type-content">
                        <img src="/assets/images/Business_account.svg" alt="" />
                        <p>Business</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="text-center login-btn">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Next"
                  />
                </div>
              </form>
              <p className="sign-up-text text-center">
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectaccountType;
