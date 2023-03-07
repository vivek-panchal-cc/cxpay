import React, { useState } from "react";
import InputOtp from "components/ui/InputOtp";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import { verifyOtpSchema } from "schemas/validationSchema";
import { otpCounterTime } from "constants/all";
import { toast } from "react-toastify";

function VerifyOtp(props) {
  const { mobile_number } = props.values;
  const [counter, setCounter] = useState(otpCounterTime);
  const [isTimerOver, setIsTimerOver] = useState(true);

  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  React.useEffect(() => {
    handleTimeOut();
  }, []);

  let formattedNumber = (counter % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let counterTime =
    Math.floor(counter / 60) + ":" + (formattedNumber ? formattedNumber : "00");

  const handleTimeOut = () => {
    setTimeout(function () {
      setIsTimerOver(false);
      formik.setStatus("");
    }, otpCounterTime * 1000);
  };

  const handleResendBtn = async () => {
    setIsTimerOver(true);
    setCounter(otpCounterTime);
    handleTimeOut();
    try {
      const { data } = await apiRequest.resendForgotPasswordOtp({
        mobile_number: mobile_number,
      });
      if (!data.success || data.data === null) throw data.message;
      toast.success(data.data.login_otp);
      toast.success(data.message);
    } catch (error) {}
  };

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
          <h3 className="lh-base">Verify your Phone Number</h3>
          <p>Pleases enter confirmation code</p>
          <form className="login-otp-numbers" onSubmit={formik.handleSubmit}>
            <div className="form-field">
              <InputOtp
                otpSize={4}
                name="user_otp"
                className={"form-control"}
                value={formik.values.user_otp}
                onChange={formik.handleChange}
                handleSubmit={formik.handleSubmit}
                error={formik.touched.user_otp && formik.errors.user_otp}
              />
            </div>
            <div className="resend-otp-wrap">
              {isTimerOver && (
                <div>
                  <span>{counterTime}</span>
                  <br />
                </div>
              )}
              <p>Didn't receive any code?</p>
              <button
                className={isTimerOver ? "disabled" : ""}
                disabled={isTimerOver}
                onClick={handleResendBtn}
              >
                Resend OTP
              </button>
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
