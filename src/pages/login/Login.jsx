import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { LoginSchema } from "schemas/validationSchema";
import { useDispatch } from "react-redux";
import { fetchLogin } from "features/user/userProfileSlice";
import { storageRequest } from "helpers/storageRequests";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = storageRequest.getAuth();
    if (token) navigate("/");
  }, []);

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm, setErrors, setStatus }) => {
      try {
        const { error, payload } = await dispatch(fetchLogin(values));
        if (error) throw payload;
      } catch (error) {
        if (typeof error === "string") setStatus(error);
        setErrors({
          user_name: error?.user_name?.[0],
          password: error?.password?.[0],
        });
      }
    },
  });

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
                    <img src="/assets/images/logo-1.png" alt="login logo img" />
                  </a>
                </div>
                <h5 className="text-center">Login</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-field">
                    <Input
                      type="mobile"
                      className="form-control"
                      placeholder="Mobile Number"
                      name="user_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.user_name}
                      error={
                        formik.touched.user_name && formik.errors.user_name
                      }
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="form-control w-100"
                      placeholder="Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <span className="eye-icon" style={{ top: "24px" }}>
                      {showPassword ? (
                        <IconEyeOpen
                          onClick={() => setShowPassword((e) => !e)}
                        />
                      ) : (
                        <IconEyeClose
                          onClick={() => setShowPassword((e) => !e)}
                        />
                      )}
                    </span>
                  </div>
                  {formik.status && (
                    <p className="text-danger text-center">{formik.status}</p>
                  )}
                  <p className="forgot-password-text text-center">
                    <a href="/forgot-password">Forgot Password?</a>
                  </p>
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      disabled={formik.isSubmitting || !formik.isValid}
                      value="Login"
                    />
                  </div>
                  <p className="sign-up-text text-center">
                    Don't have an account ? <a href="/signup">Signup</a>
                  </p>
                </form>
              </div>
              <div className="login-other-option">
                <div className="login-other-text">
                  <span>OR</span>
                </div>
                <div className="login-signup-inner login-with-opt-wrap">
                  <a className="btn btn-primary blue-bg" href="/login-with-otp">
                    Login with OTP
                  </a>
                  {/* <p className="sign-up-text text-center">
                    Don't have an account ? <a href="/signup">Signup</a>
                  </p> */}
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

export default Login;
