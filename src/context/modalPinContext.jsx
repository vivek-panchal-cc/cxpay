import ModalPaymentPin from "components/modals/ModalPaymentPin";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import { createContext, useState } from "react";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";

export const ModalPinContext = createContext({});

const ModalPinProvider = ({ children }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinModalData, setPinModalData] = useState({});
  const [pinResolver, setPinResolver] = useState(null);

  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setIsPinModalOpen);

  const openPinModal = (data = {}) => {
    setPinModalData(data);
    setIsPinModalOpen(true);

    return new Promise((resolve) => {
      setPinResolver(() => resolve); // save resolver
    });
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPinModalData({});
  };

  const handleSubmitData = async (pin) => {
    if (!pin) return;
    setPin(pin);
    if (pinResolver) {
      pinResolver(pin);
      setPinResolver(null);
    }
  };

  const handleError = (error) => {
    if (!error) return;
    setError(error);
  };

  const handleClearPinData = () => {
    setPin("");
    setIsPinModalOpen(false);
    setError(null);
    setPinModalData({});
  };

  return (
    <ModalPinContext.Provider
      value={{
        setIsPinModalOpen,
        isPinModalOpen,
        pinModalData,
        openPinModal,
        closePinModal,
        pin,
        handleClearPinData,
        handleError,
      }}
    >
      {children}
      <ModalPaymentPin
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={isPinModalOpen}
        allowClickOutSide={true}
        setShow={setIsPinModalOpen}
        heading="Enter your 5 - Digit unique PIN"
        headingImg="/assets/images/setupPin.svg"
        subHeading=""
        validationSchema={sendPaymentPinSchema}
        error={error}
        handleSubmitPin={handleSubmitData}
        handleForgotPin={handleForgotPin}
      />
      {OtpModal()}
      {PinModal()}
    </ModalPinContext.Provider>
  );
};

export default ModalPinProvider;
