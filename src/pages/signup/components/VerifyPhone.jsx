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
      const { data } = await apiRequest.resendRegisterOtp({
        mobile_number: signUpCreds.mobile_number,
      });
      if (!data.success || data.data === null) throw data.message;

      toast.success(data.data.otp);
      toast.success(data.message);
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      mobile_number: signUpCreds.mobile_number,
      user_otp: "",
    },
    validationSchema: verifyOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.verifyRegisterOtp(values);
        if (!data.success || data.data === null) throw data.message;
        setSignUpCreds((cs) => ({ ...cs, user_otp: values.user_otp, step: 1 }));
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
            <div className="resendOtp">
              {isTimerOver === "disabled" &&
                Math.floor(counter / 60) +
                  ":" +
                  (counter % 60 ? counter % 60 : "00")}
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

export default VerifyPhone;
