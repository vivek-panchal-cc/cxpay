import React, { useContext, useState } from "react";
import InputOtp from "components/ui/InputOtp";
import { useFormik } from "formik";
import { verifyOtpSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { SignupContext } from "context/signupContext";
import { otpCounterTime } from "constants/all";
import { toast } from "react-toastify";

function VerifyPhone(props) {
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const [counter, setCounter] = useState(otpCounterTime);
  const [isTimerOver, setIsTimerOver] = useState(true);
  const [error, setError] = useState(false);
  const { mobile_number, country_code } = signUpCreds || {};

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

  const formik = useFormik({
    initialValues: {
      mobile_number: mobile_number,
      country_code: country_code,
      user_otp: "",
    },
    validationSchema: verifyOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.verifyRegisterOtp(values);
        if (!data.success) throw data.message;
        setSignUpCreds((cs) => ({ ...cs, user_otp: values.user_otp, step: 1 }));
      } catch (error) {
        resetForm();
        if (typeof error === "string") setStatus(error);
      }
    },
  });

  const handleResendBtn = async () => {
    formik.setStatus("");
    setIsTimerOver(true);
    setCounter(otpCounterTime);
    handleTimeOut();
    try {
      const { data } = await apiRequest.resendRegisterOtp({
        mobile_number,
        country_code,
      });
      if (!data.success) throw data.message;
      if (data?.data?.otp) toast.success(data.data.otp);
      toast.success(data.message);
    } catch (error) {
      if (typeof error !== "string") return;
      setIsTimerOver(true);
      formik.setStatus(error);
      setError(true);
    }
  };

  const handleTimeOut = () => {
    setTimeout(function () {
      setIsTimerOver(false);
      formik.setStatus("");
    }, otpCounterTime * 1000);
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
          <h3>Verify your Phone Number</h3>
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
                tabIndex="0"
                title="Tooltip on top"
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyPhone;
