import React, { useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/css/responsive.css";
import logo from "../../assets/images/logo-1.png";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="login-signup common-body-bg">
      <div className="container login-signup-01">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="#">
                  <img src={logo} alt="login logo image" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Select Account Type
              </h4>
              <form>
                <div className="radio-wrap">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                    />
                    <label className="form-check-label" for="flexRadioDefault1">
                      Personal Account
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      checked="checked"
                    />
                    <label className="form-check-label" for="flexRadioDefault2">
                      Business Account
                    </label>
                  </div>
                </div>
                <div className="text-center login-btn">
                  <a href="#">
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Next"
                    />
                  </a>
                </div>
                <p className="sign-up-text text-center">
                  Already have an account? <a href="#">Login</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
