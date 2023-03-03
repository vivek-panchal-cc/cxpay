import React, { useState } from "react";
import InputOtp from "components/ui/InputOtp";
import { useFormik } from "formik";
import { verifyLoginOtpSchema } from "schemas/validationSchema";
import { fetchLoginOtp } from "features/user/userProfileSlice";
import { useDispatch } from "react-redux";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { otpCounterTime } from "constants/all";

function VerifyLoginOtp(props) {
  const { mobileNumber } = props;
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

  const handleTimeOut = () => {
    setTimeout(function () {
      setIsTimerOver(false);
    }, otpCounterTime * 1000);
  };

  let formattedNumber = (counter % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let counterTime =
    Math.floor(counter / 60) + ":" + (formattedNumber ? formattedNumber : "00");

  const handleResendBtn = async () => {
    setIsTimerOver(true);
    setCounter(otpCounterTime);
    handleTimeOut();
    try {
      const { data } = await apiRequest.resendLoginOtp({
        mobile_number: mobileNumber,
      });
      if (!data.success || data.data === null) throw data.message;
      toast.success(data.data.login_otp);
      toast.success(data.message);
    } catch (error) {}
  };
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      mobile_number: mobileNumber,
      login_otp: "",
    },
    validationSchema: verifyLoginOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { error, payload } = await dispatch(fetchLoginOtp(values));
        if (error) throw payload;
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
                name="login_otp"
                className={"form-control"}
                value={formik.values.login_otp}
                onChange={formik.handleChange}
                handleSubmit={formik.handleSubmit}
                error={formik.touched.login_otp && formik.errors.login_otp}
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

export default VerifyLoginOtp;
