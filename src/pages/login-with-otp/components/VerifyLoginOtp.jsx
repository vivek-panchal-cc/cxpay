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
  const [isTimerOver, setIsTimerOver] = useState("disabled");

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
      setIsTimerOver("");
    }, otpCounterTime * 1000);
  };

  const handleResendBtn = async () => {
    setIsTimerOver("disabled");
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
                error={formik.touched.login_otp && formik.errors.login_otp}
              />
            </div>
            <div class="resend-otp-wrap">
              {isTimerOver === "disabled" && (
                <div>
                  <span>
                    {" "}
                    {isTimerOver === "disabled" &&
                      Math.floor(counter / 60) +
                        ":" +
                        (counter % 60 ? counter % 60 : "00")}
                  </span>
                  <br />
                </div>
              )}
              <p>Didn't receive any code?</p>
              <button
                className={isTimerOver}
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
