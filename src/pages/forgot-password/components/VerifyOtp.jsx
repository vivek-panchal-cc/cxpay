import React, { useState } from "react";
import InputOtp from "components/ui/InputOtp";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import { verifyForgotPasswordOtpSchema } from "schemas/validationSchema";
import { otpCounterTime } from "constants/all";
import { toast } from "react-toastify";

function VerifyOtp(props) {
  const { mobile_number, country_code } = props.values;

  const navigate = useNavigate();

  const { setShow } = props;
  const [counter, setCounter] = useState(otpCounterTime);
  const [isTimerOver, setIsTimerOver] = useState(true);
  const [error, setError] = useState(false);

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

  const formik = useFormik({
    initialValues: {
      country_code: country_code,
      mobile_number: mobile_number,
      user_otp: "",
    },
    validationSchema: verifyForgotPasswordOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.verifyForgotPasswordOtp(values);
        if (!data.success) throw data;
        if (data.data.mobile_number)
          navigate(
            `/reset-password/${values.country_code}/${data.data.mobile_number}/${data.data.password_token}`
          );
      } catch (error) {
        resetForm();
        const { message = "", data } = error || {};
        if (data?.suspend_account) {
          toast.error(message);
          navigate("/login", { replace: true });
        }
        if (typeof message === "string") setStatus(message);
      }
    },
  });

  const handleResendBtn = async () => {
    formik.setStatus("");
    setIsTimerOver(true);
    setCounter(otpCounterTime);
    handleTimeOut();
    try {
      const { data } = await apiRequest.resendForgotPasswordOtp({
        country_code: country_code,
        mobile_number: mobile_number,
      });
      if (!data.success) throw data.message;
      toast.success(data.data.login_otp);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") {
        if (typeof error === "string") formik.setStatus(error);
        setIsTimerOver(true);
        setError(true);
      }
    }
  };

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
          <p>Please enter confirmation code</p>
          <form className="login-otp-numbers" onSubmit={formik.handleSubmit}>
            <div className="form-field">
              <InputOtp
                otpSize={4}
                name="user_otp"
                className={"form-control"}
                value={formik.values.user_otp}
                onChange={formik.handleChange}
                isSubmitting={formik.isSubmitting}
                handleSubmit={formik.handleSubmit}
                error={formik.touched.user_otp && formik.errors.user_otp}
              />
            </div>
            <div className="resend-otp-wrap">
              {isTimerOver && !error ? (
                <div>
                  <span>{counterTime}</span>
                  <br />
                </div>
              ) : null}
              <p>Didn't receive any code?</p>
              <button
                type="button"
                className={isTimerOver ? "disabled" : ""}
                disabled={isTimerOver}
                onClick={handleResendBtn}
              >
                Resend OTP
              </button>
            </div>
            <div className="popup-btn-wrap">
              {formik.status ? (
                <p className="text-danger">{formik.status}</p>
              ) : null}
              <input
                type="submit"
                className="btn btn-primary"
                value="Verify"
                disabled={formik.isSubmitting}
              />
            </div>
            <div className="pop-cancel-btn text-center">
              <button type="button" onClick={() => setShow(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
