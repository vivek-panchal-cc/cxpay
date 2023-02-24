import React, { useContext, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { enterPhoneSchema } from "schemas/validationSchema";
import AlreadyRegistered from "./AlreadyRegistered";
import VerifyPhone from "./VerifyPhone";
import Modal from "components/modals/Modal";
import { SignupContext } from "context/signupContext";

function EnterPhone(props) {
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const [showRegisteredPopup, setShowregisteredPopup] = useState(false);
  const [showVerifyPhonePopup, setShowVerifyPhonePopup] = useState(false);
  const [username, setUsername] = useState("USERNAME");

  const formik = useFormik({
    initialValues: {
      mobile_number: "",
    },
    validationSchema: enterPhoneSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.verifyMobileNumber(values);
        if (!data.success || data.data === null) throw data.message;
        if (data.data.isAlreadyRegster === "1") {
          setUsername(data.data?.user_name);
          return setShowregisteredPopup(true);
        }
        setSignUpCreds((cs) => ({
          ...cs,
          mobile_number: values.mobile_number,
        }));
        setShowVerifyPhonePopup(true);
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
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
                <VerifyPhone {...{ signUpCreds, setSignUpCreds }} />
              </Modal>
              <Modal
                id="already_register_user"
                show={showRegisteredPopup}
                setShow={setShowregisteredPopup}
              >
                <AlreadyRegistered username={username} />
              </Modal>
              <h4 className="text-center">Welcome to</h4>
              <div className="login-logo-image text-center">
                <a href="/">
                  <img src="/assets/images/logo-1.png" alt="login logo img" />
                </a>
              </div>
              <h5 className="text-center">Signup</h5>
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
  );
}

export default EnterPhone;
