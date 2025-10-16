import React, { useContext, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { enterEmailSchema } from "schemas/validationSchema";
import AlreadyRegistered from "./AlreadyRegistered";
import VerifyEmail from "./VerifyEmail";
import Modal from "components/modals/Modal";
import { SignupContext } from "context/signupContext";
import { toast } from "react-toastify";
import { CXPAY_LOGO } from "constants/all";
import { Link } from "react-router-dom";

function EnterEmail(_props) {
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const [showRegisteredPopup, setShowregisteredPopup] = useState(false);
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: enterEmailSchema,
    validateOnMount: true,
    onSubmit: async (values, { setErrors }) => {
      try {
        const { data } = await apiRequest.verifyEmail(values);
        if (!data.success) throw data.message;
        if (data.data.isAlreadyRegster) {
          return setShowregisteredPopup(true);
        }
        setSignUpCreds((cs) => ({
          ...cs,
          email: values.email,
        }));
        setShowVerifyPhonePopup(true);
        if (data?.data?.otp) toast.success(data.data.otp);
        toast.success(data.message);
      } catch (error) {
        setErrors({
          email: error.email?.[0],
        });
      }
    },
  });

  return (
    <div className="container login-signup-01">
      <div className="row">
        <div className="col-xs-12">
          <div className="login-signup-content-wrap login-signup01-content-wrap">
            <div className="login-signup-inner">
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src={CXPAY_LOGO} alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
              <h4 className="blue-text text-center">Please Enter Email</h4>
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
                    autoComplete={"new-email"}
                  />
                </div>
                <div className="text-center send-cd-btn">
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    } ${formik.isValid ? "" : "opacity-75"}`}
                    value="Send Code"
                    disabled={formik.isSubmitting}
                  />
                </div>
                <p className="sign-up-text text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal id="login_otp_modal" show={showVerifyPhonePopup}>
        <VerifyEmail {...{ signUpCreds, setSignUpCreds }} />
      </Modal>
      <Modal id="already_register_user" show={showRegisteredPopup}>
        <AlreadyRegistered />
      </Modal>
    </div>
  );
}

export default EnterEmail;
