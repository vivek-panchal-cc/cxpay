import { useFormik } from "formik";
import React from "react";
import Input from "components/ui/Input";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "schemas/validationSchema";

function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      mobile_number: params.mobile,
      password: "",
      confirm_password: "",
      token: params.token,
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.updateForgotPassword(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/login");
      } catch (error) {
        resetForm();
        setStatus(error);
        console.log(error);
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
                      type={"password"}
                      className="form-control"
                      placeholder="New Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={formik.touched.password && formik.errors.password}
                      autoComplete={"new-password"}
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      type="password"
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
                    />
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
