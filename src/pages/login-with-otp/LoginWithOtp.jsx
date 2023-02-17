import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "shared/cookies";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { enterPhoneSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import Modal from "components/modals/Modal";
import VerifyLoginOtp from "./components/VerifyLoginOtp";

const LoginWithOtp = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("auth._token.Bearer");
    if (token) navigate("/");
  }, [navigate]);

  const [mobileNumber, setMobileNumber] = useState("");
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      mobile_number: "",
    },
    validationSchema: enterPhoneSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.loginOtp(values);
        if (!data.success || data.data === null) throw data.message;
        setMobileNumber(values.mobile_number);
        setShowVerifyPhonePopup(true);
      } catch (error) {
        resetForm();
        setStatus(error);
      }
    },
  });
  return (
    <div className="login-signup common-body-bg">
      <div className="container login-signup-01">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="login-signup-inner">
                <Modal
                  id="login_otp_modal"
                  show={showVerifyPhonePopup}
                  setShow={setShowVerifyPhonePopup}
                >
                  <VerifyLoginOtp mobileNumber={mobileNumber} />
                </Modal>
                <h4 className="text-center">Welcome to</h4>
                <div className="login-logo-image text-center">
                  <a href="/">
                    <img src="/assets/images/logo-1.png" alt="login logo img" />
                  </a>
                </div>
                <h5 className="text-center">Login with OTP</h5>
                <h4 className="blue-text text-center">
                  Please Enter Mobile Number
                </h4>
                <form onSubmit={formik.handleSubmit}>
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
                        formik.touched.mobile_number &&
                        formik.errors.mobile_number
                      }
                    />
                  </div>
                  <div className="text-center send-cd-btn">
                    {formik.status && (
                      <p className="text-danger">{formik.status}</p>
                    )}
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Send Code"
                      disabled={formik.isSubmitting}
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
      </div>
    </div>
  );
};

export default LoginWithOtp;
