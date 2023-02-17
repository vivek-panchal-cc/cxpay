import { useFormik } from "formik";
import React, { useState } from "react";
import Input from "components/ui/Input";
import Modal from "components/modals/Modal";
import VerifyOtp from "./components/VerifyOtp";
import { apiRequest } from "helpers/apiRequests";
import { forgotPasswordSchema } from "schemas/validationSchema";

function ForgotPassword() {
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      mobile_number: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.generateForgotPasswordOtpChange(
          values
        );
        if (!data.success || data.data === null) throw data.message;
        setShowOtpPopup(true);
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
                <h5 className="text-center">Forgot Password</h5>
                <Modal
                  id="forgot-password-popup"
                  show={showOtpPopup}
                  setShow={setShowOtpPopup}
                >
                  <VerifyOtp values={formik.values} />
                </Modal>
                <form onSubmit={formik.handleSubmit}>
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
                    />
                  </div>
                  <div className="form-field">
                    <Input
                      type="text"
                      className="form-control w-100"
                      placeholder="Phone"
                      name="mobile_number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile_number}
                      error={
                        formik.touched.mobile_number &&
                        formik.errors.mobile_number
                      }
                    />
                  </div>
                  <div className="text-center login-btn">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      disabled={formik.isSubmitting}
                      value="Send Confirmation Code"
                    />
                  </div>
                  <p className="sign-up-text text-center">
                    Don't have an account ? <a href="/signup">Signup</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
