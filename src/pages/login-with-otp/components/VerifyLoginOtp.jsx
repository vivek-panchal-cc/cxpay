import React from "react";
import OtpInput from "components/ui/OtpInput";
import { useFormik } from "formik";
import { verifyLoginOtpSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";

function VerifyLoginOtp(props) {
  const { mobileNumber } = props;

  const navigate = useNavigate();

  var now = new Date();
  var time = now.getTime();
  // token will expire after 1 hrs
  time += 1 * 60 * 60 * 1000;
  now.setTime(time);

  const formik = useFormik({
    initialValues: {
      mobile_number: mobileNumber,
      login_otp: "",
    },
    validationSchema: verifyLoginOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      console.log(values);
      try {
        const { data } = await apiRequest.verifyLoginOtp(values);
        if (!data.success || data.data === null) throw data.message;
        if (data?.data?.user_name) {
          document.cookie =
            "auth._token.Bearer=" +
            data?.data?.user_name +
            "; expires=" +
            now.toGMTString() +
            "; path=/";
        }
        navigate("/");
      } catch (error) {
        resetForm();
        setStatus(error);
      }
    },
  });

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <div className="">
            <img src="/assets/images/unlock-tick.svg" alt="Unlock" />
          </div>
        </div>
        <div className="modal-body">
          <h3>Verify your Phone Number</h3>
          <p>Pleases enter confirmation code</p>
          <form className="login-otp-numbers" onSubmit={formik.handleSubmit}>
            <div className="form-field">
              <OtpInput
                otpSize={4}
                name="login_otp"
                className={"form-control"}
                value={formik.values.login_otp}
                onChange={formik.handleChange}
                error={formik.touched.login_otp && formik.errors.login_otp}
              />
            </div>
            <div className="popup-btn-wrap">
              {formik.status && <p className="text-danger">{formik.status}</p>}
              <input
                type="submit"
                className="btn btn-primary"
                value="Verify"
                data-bs-dismiss="modal"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyLoginOtp;
