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
import { storageRequest } from "helpers/storageRequests";
import { LoaderContext } from "context/loaderContext";

function VerifyNewMobileOtp(props) {
  const { mobileNumber, countryCode, customer_id, setShow, setMobileChange } = props;
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(1);
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
      verify_number_flag: "new_number",
      customer_id: customer_id,
      login_otp: "",
    },
    validationSchema: verifyLoginOtpSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("user_mobile_otp", values.login_otp);
        formData.append("verify_number_flag", values.verify_number_flag);
        formData.append("customer_id", customer_id);
        formData.append("country_code", countryCode);
        formData.append("mobile_number", mobileNumber);
        const { data } = await apiRequest.verifyChangeMobileOtp(formData);
        if (!data.success) {
          setAttempts((prevAttempts) => prevAttempts + 1);
          if (attempts >= 3) {
            toast.error("Failed to verify OTP.");
            setAttempts(1);
            setShow(false);
            setMobileChange(false)
            return false;
          }
          throw data.message;
        }
        toast.success(`${data.message}`);
        storageRequest.removeAuth();
        navigate("/", { replace: true });
      } catch (error) {                
        if (typeof error === "string") toast.error(error);
        return false;
      } finally{
        resetForm();
        setIsLoading(false);
      }
    },
  });

  const handleResendBtn = async () => {
    formik.setStatus("");
    setIsTimerOver(true);
    setCounter(otpCounterTime);
    handleTimeOut();
    setIsLoading(true);
    try {
      const { data } = await apiRequest.createChangeMobileOtp({
        country_code: countryCode,
        mobile_number: mobileNumber,
        verify_number_flag: "new_number",
        verification_via: "sms",
        customer_id: customer_id,
      });
      if (!data.success) throw data.message;
      if (data?.data?.otp) toast.success(data.data.otp);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") {
        setIsTimerOver(true);
        formik.setStatus(error);
        setError(true);
      }
    } finally{
      formik?.resetForm();
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <div className="">
            <img src="/assets/images/sent-payment-otp-pop.svg" alt="Otp" />
          </div>
        </div>
        <div className="modal-body">
          <h3>Verify your Phone Number</h3>
          <p>We have sent you a verification code to your new mobile number. Enter the OTP below.</p>
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

export default VerifyNewMobileOtp;
