import React from "react";
import InputOtp from "components/ui/InputOtp";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import { verifyOtpSchema } from "schemas/validationSchema";

function VerifyOtp(props) {
  const { mobile_number } = props.values;

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      mobile_number: mobile_number,
      user_otp: "",
    },
    validationSchema: verifyOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.verifyForgotPasswordOtp(values);
        if (!data.success || data.data === null) throw data.message;
        if (data.data.mobile_number)
          navigate(
            `/reset-password/${data.data.mobile_number}/${data.data.password_token}`
          );
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
              <InputOtp
                otpSize={4}
                name="user_otp"
                className={"form-control"}
                value={formik.values.user_otp}
                onChange={formik.handleChange}
                error={formik.touched.user_otp && formik.errors.user_otp}
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

export default VerifyOtp;
