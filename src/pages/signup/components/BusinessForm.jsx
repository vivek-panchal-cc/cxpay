import React, { useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { signUpBusinessAccountSchema } from "schemas/validationSchema";
import FileInput from "components/ui/FileInput";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Businessform(props) {
  const { signUpCreds, setSignUpCreds } = props;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      company_name: "",
      user_type: signUpCreds.user_type || "business",
      email: "",
      password: "",
      confirm_password: "",
      mobile_number: signUpCreds.mobile_number,
      profile_image: "",
    },
    validationSchema: signUpBusinessAccountSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      try {
        const { data } = await apiRequest.registerUser(values);
        if (!data.success || data.data === null) throw data.message;
        setSignUpCreds({ step: 0 });
        toast.success(data.message);
        navigate("/login");
      } catch (error) {
        setErrors({
          email: error.email?.[0],
          mobile_number: error.mobile_number?.[0],
        });
      }
    },
  });
  return (
    <div className="container login-signup-01 login-signup-02">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <form onSubmit={formik.handleSubmit}>
              <FileInput
                name="profile_image"
                onChange={(e) => {
                  formik.setFieldValue(
                    "profile_image",
                    e.currentTarget.files[0]
                  );
                }}
                error={formik.errors.profile_image}
                showPreview={true}
                showLabel={true}
                labelText="Change Profile Picture"
                defaultImg="/assets/images/profile-img.png"
                classNameInput="d-none"
              />
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">
                Please Enter Business Details
              </h4>
              <div className="form-field">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Company Name"
                  name="company_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.company_name}
                  error={
                    formik.touched.company_name && formik.errors.company_name
                  }
                />
              </div>
              <div className="form-field">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Mobile Number"
                  name="mobile_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile_number}
                  error={
                    formik.touched.mobile_number && formik.errors.mobile_number
                  }
                />
              </div>
              <div className="form-field">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.touched.email && formik.errors.email}
                  autoComplete={"new-email"}
                />
              </div>
              <div className="form-field">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="form-control w-100 position-relative"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  error={formik.touched.password && formik.errors.password}
                  autoComplete={"new-password"}
                />
                <span className="eye-icon" style={{ top: "11px" }}>
                  <img
                    className="eye-close"
                    src="/assets/images/eye-close.png"
                    alt="eye close icon"
                    onClick={() => setShowPassword((e) => !e)}
                  />
                </span>
              </div>
              <div className="form-field">
                <Input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  name="confirm_password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirm_password}
                  error={
                    formik.touched.confirm_password &&
                    formik.errors.confirm_password
                  }
                />
                {formik.touched.confirm_password &&
                  !formik.errors.confirm_password && (
                    <span className="eye-icon top-50 translate-middle">
                      <img
                        className="eye-close"
                        src="/assets/images/green-tick.svg"
                        alt="eye close icon"
                      />
                    </span>
                  )}
              </div>
              <div className="text-center sign-up-btn">
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Signup"
                />
              </div>
              <p className="sign-up-text text-center">
                Already have an account? <a href="/login">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Businessform;
