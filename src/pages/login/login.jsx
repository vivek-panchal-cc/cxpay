import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "../../assets/css/bootstrap.min.css";
// import "../../assets/css/style.css";
// import "../../assets/css/responsive.css";
import logo from "../../assets/images/logo-1.png";
import { ToastContainer, toast } from "react-toastify";
import { loginApi } from "apiService/auth.js";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "shared/cookies";
import * as userAction from "store/actions/userAction";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = getCookie("auth._token.Bearer");
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Username:", email);
    console.log("Password:", password);
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("email and password are required");
      setLoading(false);
      return;
    }
    let payload = {
      email,
      password,
    };
    // make api call here
    let response = await loginApi(payload);
    console.log("login response :>> ", response.data.success);
    if (response.data.success) {
      navigate("/");
    } else {
      setError("Given credentials are invalid.");
    }
  };

  return (
    <div className="login-signup common-body-bg">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap">
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="#">
                  <img src={logo} alt="login logo image" />
                </a>
              </div>
              <h5 className="text-center">Login</h5>
              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Email or Phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="forgot-password-text text-center">
                  <a href="#">Forgot Password?</a>
                </p>
                <p className="text-danger text-center">{error}</p>
                <div className="text-center login-btn">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="LogIn"
                  />
                </div>
                <p className="sign-up-text text-center">
                  Don't have an account ? <a href="#">Signup</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
