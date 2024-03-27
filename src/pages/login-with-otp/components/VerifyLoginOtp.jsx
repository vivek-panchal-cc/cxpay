import React, { useContext, useState } from "react";
import InputOtp from "components/ui/InputOtp";
import { useFormik } from "formik";
import { verifyLoginOtpSchema } from "schemas/validationSchema";
import { fetchLoginOtpVerify } from "features/user/userProfileSlice";
import { useDispatch } from "react-redux";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { otpCounterTime } from "constants/all";
import { useNavigate } from "react-router-dom";
import { SystemOptionsContext } from "context/systemOptionsContext";

function VerifyLoginOtp(props) {
  const { mobileNumber, countryCode, setShow } = props;
  const { MANUAL_KYC } = useContext(SystemOptionsContext);
  const navigate = useNavigate();
  const message =
    "You have almost completed the signup process. While your personal information is being validated, you will receive a confirmation within 2 business days.";

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

  const handleTimeOut = () => {
    setTimeout(function () {
      setIsTimerOver(false);
      formik.setStatus("");
    }, otpCounterTime * 1000);
  };

  let formattedNumber = (counter % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let counterTime =
    Math.floor(counter / 60) + ":" + (formattedNumber ? formattedNumber : "00");
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      country_code: countryCode,
      mobile_number: mobileNumber,
      login_otp: "",
    },
    validationSchema: verifyLoginOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { error, payload } = await dispatch(fetchLoginOtpVerify(values));
        if (error) throw payload;
        // if (MANUAL_KYC === "false") {
        //   if (payload.data.kyc_attempt_count >= 3) {
        //     window.location.href = `/complete-kyc-initial?message=${encodeURIComponent(
        //       message
        //     )}`;
        //   }
        // }
        navigate("/", { replace: true });
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
      const { data } = await apiRequest.resendLoginOtp({
        country_code: countryCode,
        mobile_number: mobileNumber,
      });
      if (!data.success) throw data.message;
      if (data?.data?.login_otp) toast.success(data.data.login_otp);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") {
        setIsTimerOver(true);
        formik.setStatus(error);
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
          <h3>Verify your Phone Number</h3>
          <p>Please enter confirmation code</p>
          <form className="login-otp-numbers" onSubmit={formik.handleSubmit}>
            <div className="form-field">
              <InputOtp
                otpSize={4}
                name="login_otp"
                className={"form-control"}
                value={formik.values.login_otp}
                onChange={formik.handleChange}
                isSubmitting={formik.isSubmitting}
                handleSubmit={formik.handleSubmit}
                error={formik.touched.login_otp && formik.errors.login_otp}
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

export default VerifyLoginOtp;
