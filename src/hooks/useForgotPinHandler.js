import { apiRequest } from "helpers/apiRequests";
import { useContext, useState } from "react";
import { sendPaymentOtpSchema, setPinSchema } from "schemas/sendPaymentSchema";
import ModalOtpConfirmation from "components/modals/ModalOtpConfirmation";
import { LoaderContext } from "context/loaderContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ModalPinConfirmation from "components/modals/ModalPinConfirmation";

const useForgotPinHandler = (setShowPinPopup) => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [pinModal, setPinModal] = useState(false);
  const { mobile_number } = useSelector((state) => state?.userProfile?.profile);

  const handleForgotPin = async () => {
    setIsLoading(true);    
    try {
      const { data } = await apiRequest.forgotPinOtp({
        mobile_number: mobile_number,
      });
      if (!data.success) throw data.message;
      if (data?.data?.login_otp) toast.success(`${data?.data?.login_otp}`);
      toast.success(`${data.message}`);
      setShowOtpModal(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.forgotPinOtp({
        mobile_number: mobile_number,
      });
      if (!data.success) throw data.message;
      if (data?.data?.login_otp) toast.success(`${data?.data?.login_otp}`);
      toast.success(`${data.message}`);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async (otp) => {
    if (!otp || !mobile_number) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.verifyPinOtp({
        mobile_number,
        user_otp: otp,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      setShowOtpModal(false);
      setPinModal(true);
      return true;
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPin = async (pin, confirmPin) => {
    if (!pin || !confirmPin) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.pinSet({
        new_pin: pin,
        confirm_pin: confirmPin,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      setPinModal(false);
      setShowPinPopup(false);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const OtpModal = () => (
    <ModalOtpConfirmation
      id="group_pay_otp_modal"
      className="otp-verification-modal group_pay_otp_modal"
      show={showOtpModal}
      allowClickOutSide={true}
      setShow={setShowOtpModal}
      heading="OTP Verification"
      headingImg="/assets/images/sent-payment-otp-pop.svg"
      subHeading="We have sent you verification code to change pin. Enter OTP below"
      validationSchema={sendPaymentOtpSchema}
      handleSubmitOtp={handleSubmitOtp}
      handleResendOtp={handleResendOtp}
    />
  );

  const PinModal = () => (
    <ModalPinConfirmation
      id="group_pay_otp_modal"
      className="otp-verification-modal group_pay_otp_modal"
      show={pinModal}
      allowClickOutSide={true}
      setShow={setPinModal}
      heading="5 - Digit PIN Access"
      headingImg="/assets/images/setupPin.svg"
      subHeading="Secure your account with 5 - Digit PIN Access"
      validationSchema={setPinSchema}
      handleSubmitPin={handleSubmitPin}
    />
  );

  return { handleForgotPin, OtpModal, PinModal };
};

export default useForgotPinHandler;
