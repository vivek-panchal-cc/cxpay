import Button from "components/ui/Button";
import { useFormik } from "formik";
import Image from "components/ui/Image";
import { LoaderContext } from "context/loaderContext";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookMessengerIcon,
  WhatsappIcon,
} from "react-share";
import { IconClear, IconSend, IconSetAmountEdit } from "styles/svgs";
import ImageQR from "components/ui/ImageQR";
import LoaderProfileQr from "loaders/LoaderProfileQr";
import { CURRENCY_SYMBOL } from "constants/all";
import { setQrAmount } from "schemas/validationSchema";
import ModalSetAmount from "components/modals/ModalSetAmount";
import WrapAmount from "components/wrapper/WrapAmount";

const QrCode = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const [isEditable, setIsEditable] = useState(false);
  const [amount, setAmount] = useState(null);
  const [customQR, setCustomQR] = useState("");
  const [tempAmount, setTempAmount] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState({
    show: false,
    message: "",
  });
  const { qrCodeImg } = props;
  const appId = process.env.REACT_APP_FACEBOOK_APP_ID;
  const title = "Check out this QR code!";
  const dispatch = useDispatch();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleGenerateQrCode = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.generateNewQrCode();
      if (!data.success) throw data.message;
      await dispatch(fetchUserProfile());
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: setQrAmount,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.updateBusinessUrl(values);
        if (!data.success) throw data.message;
        setIsEditable(false);
        toast.success(data.message);
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          amount: error?.amount?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSubmitAmount = async (value, specification) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.createCustomeQrCode({
        QR_amount: +value,
        QR_specification: specification,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      setCustomQR(data?.data.qr_code_image);
      setAmount(value);
      setShowConfirmPopup(false);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAmount = () => {
    setShowConfirmPopup({ show: true, message: "" });
  };

  const handleClearAmount = async () => {
    setCustomQR("");
    setAmount(null);
    // await dispatch(fetchUserProfile());
  };

  // const handleShareQrCode = () => {
  //   if (qrCodeImg) {
  //     clipboardCopy(qrCodeImg);
  //     toast.success("QR code link copied to clipboard!");
  //   } else {
  //     toast.error("No QR code link available to share.");
  //   }
  // };

  const handleWhatsAppShare = () => {
    const message = `Check out this QR code: ${qrCodeImg}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleMessengerShare = () => {
    const encodedURL = encodeURIComponent(qrCodeImg);
    const messengerURL = `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodedURL}&redirect_uri=${encodedURL}`;
    window.open(messengerURL, "_blank");
  };

  const handleEmailShare = () => {
    const subject = "Check out this QR code!";
    const body = `Here is a QR code you might be interested in:\n${qrCodeImg}\nPlease copy and paste the link into your browser to view the QR code.`;
    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:?subject=${subject}&body=${encodedBody}`, "_self");
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <>
      <div className="profile-qr">
        <div className="profile-qr-inner">
          {isImageLoading && <LoaderProfileQr height={120} width={120} />}
          {!imageError ? (
            <ImageQR
              src={customQR || qrCodeImg || ""}
              fallbacksrc={"/assets/images/QR_not_found.png"}
              alt="QR code image"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={isImageLoading ? { display: "none" } : {}}
            />
          ) : (
            <div>Failed to load QR</div>
          )}
        </div>
        {/* Set Amount Section */}
        {amount === null ? (
          <button
            type="button"
            onClick={handleSetAmount}
            className="set-amount-btn border-0 mb-3 d-flex gap-2 justify-content-center"
          >
            Set Amount
            <IconSetAmountEdit stroke={"#363853"} />
          </button>
        ) : (
          // <div className="amount-display d-flex align-items-center">
          <button
            type="button"
            className="set-amount-btn border-0 mb-3 d-flex gap-2 justify-content-center cursor-default"
          >
            <span className="flex-grow-1">
              <WrapAmount value={amount} />
            </span>

            <IconClear
              className="cursor-pointer"
              stroke={"#363853"}
              onClick={handleClearAmount}
            />
          </button>
          // </div>
        )}
        <Button
          type="button"
          onClick={handleGenerateQrCode}
          className="btn qr-btn"
          style={{ marginBottom: "20px" }}
          disabled={isImageLoading || imageError}
        >
          Refresh QR
        </Button>
        {(customQR || qrCodeImg) && (
          <Button
            type="button"
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="btn qr-share-icon"
            disabled={isImageLoading || imageError}
          >
            <span>
              <IconSend style={{ stroke: "#F3F3F3" }} />
            </span>
          </Button>
        )}
        {showShareOptions && (
          <div className={`share-options ${showShareOptions ? "active" : ""}`}>
            <WhatsappShareButton url={customQR || qrCodeImg} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            {/* <FacebookMessengerShareButton appId={appId} url={qrCodeImg}>
            <FacebookMessengerIcon size={32} round />
          </FacebookMessengerShareButton> */}

            <EmailShareButton
              url={customQR || qrCodeImg}
              subject={title}
              body={`Here is a QR code you might be interested in:`}
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        )}
      </div>
      <div className="payment-blocks-inner">
        <ModalSetAmount
          id="set-qr-amount"
          show={showConfirmPopup.show}
          setShow={setShowConfirmPopup}
          heading="Enter Amount"
          subHeading=""
          handleCallback={handleSubmitAmount}
          error={showConfirmPopup.message}
        ></ModalSetAmount>
      </div>
    </>
  );
};

export default QrCode;
