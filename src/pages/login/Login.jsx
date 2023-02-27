import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { LoginSchema } from "schemas/validationSchema";
import { useDispatch } from "react-redux";
import { fetchLogin } from "features/user/userProfileSlice";
import { storageRequest } from "helpers/storageRequests";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { error, payload } = await dispatch(fetchLogin(values));
        if (error) throw payload;
      } catch (error) {
        setStatus(error);
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
                      type="text"
                      className="form-control"
                      placeholder="Phone"
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
                      type="password"
                      className="form-control w-100"
                      placeholder="Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                    />
                  </div>
                  {formik.status && (
                    <p className="text-danger">{formik.status}</p>
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
                      value="LogIn"
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
