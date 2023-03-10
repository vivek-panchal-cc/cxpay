import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import Input from "components/ui/Input";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "schemas/validationSchema";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";

function ResetPassword() {
  const { setIsLoading } = useContext(LoaderContext);
  const params = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const formik = useFormik({
    initialValues: {
      mobile_number: params.mobile,
      password: "",
      confirm_password: "",
      token: params.token,
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.updateForgotPassword(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/login");
      } catch (error) {
        resetForm();
        setStatus(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!params.token) navigate("/");
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
                <h5 className="text-center">Reset Password</h5>
                <form onSubmit={formik.handleSubmit}>
                  <div className="form-field">
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      className="form-control"
                      placeholder="New Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                      autoComplete={"new-password"}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <span className="eye-icon" style={{ top: "24px" }}>
                      {showPassword.new ? (
                        <IconEyeOpen
                          onClick={() =>
                            setShowPassword((e) => ({ ...e, new: !e.new }))
                          }
                        />
                      ) : (
                        <IconEyeClose
                          onClick={() =>
                            setShowPassword((e) => ({ ...e, new: !e.new }))
                          }
                        />
                      )}
                    </span>
                  </div>
                  <div className="form-field">
                    <Input
                      type={showPassword.confirm ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm Password"
                      name="confirm_password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirm_password}
                      error={
                        formik.touched.confirm_password &&
                        formik.errors.confirm_password
                      }
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    {formik.touched.confirm_password &&
                      !formik.errors.confirm_password && (
                        <span
                          className="eye-icon"
                          style={{ top: "24px", right: "45px" }}
                        >
                          <img
                            className="eye-close"
                            src="/assets/images/green-tick.svg"
                            alt="eye close icon"
                          />
                        </span>
                      )}
                    <span className="eye-icon" style={{ top: "24px" }}>
                      {showPassword.confirm ? (
                        <IconEyeOpen
                          onClick={() =>
                            setShowPassword((e) => ({
                              ...e,
                              confirm: !e.confirm,
                            }))
                          }
                        />
                      ) : (
                        <IconEyeClose
                          onClick={() =>
                            setShowPassword((e) => ({
                              ...e,
                              confirm: !e.confirm,
                            }))
                          }
                        />
                      )}
                    </span>
                  </div>
                  {formik.status && (
                    <p className="text-danger">{formik.status}</p>
                  )}
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      disabled={formik.isSubmitting}
                      value="Change Password"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
