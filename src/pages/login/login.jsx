import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "apiService/auth.js";
import { getCookie } from "shared/cookies";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { LoginSchema } from "schemas/validationSchema";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("auth._token.Bearer");
    if (token) navigate("/");
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await loginApi(values);
        if (!data.success || data.data === null) throw data.message;
        console.log(data);
        navigate("/");
      } catch (error) {
        resetForm();
        console.log(error);
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
                      placeholder="Email or Phone"
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
                  <p className="forgot-password-text text-center">
                    <a href="/">Forgot Password?</a>
                  </p>
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      disabled={formik.isSubmitting}
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
                  <p className="sign-up-text text-center">
                    Don't have an account ? <a href="/signup">Signup</a>
                  </p>
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
